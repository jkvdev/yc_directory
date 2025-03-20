import Ping from "@/components/Ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { unstable_after as after } from "next/server";

const View = async ({ id }: { id: string }) => {
  // Get total views from sanity
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

  // Increment the number of views after each page hit
  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit()
  );

  return (
    <div className="view-container !bottom-20 !right-4">
      {/* Ping Ticker */}
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      {/* PPR view count */}
      <p className="view-text">
        <span className="font-black">
          {totalViews ? totalViews : 0} View{totalViews != 1 && "s"}
        </span>
      </p>
    </div>
  );
};
export default View;
