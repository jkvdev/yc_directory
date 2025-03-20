import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import UserStartups from "@/components/UserStartups";
import { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";

// Enable PPR
export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  // Get ID from URL
  const id = (await params).id;
  // Get Auth Session
  const session = await auth();

  // Get User by ID
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  // If User not found, return 404
  if (!user) return notFound();

  return (
    <>
      <section className="profile_container">
        {/* Profile Card */}
        <div className="profile_card">
          {/* Profile title */}
          <div className="profile_title">
            {/* User name */}
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>

          {/* User Image */}
          <div className="profile_image overflow-hidden w-56 h-56 rounded-full flex align-center justify-center">
            <Image
              src={user.image}
              alt={user.name}
              width={220}
              height={220}
              layout="intrinsic"
              className="object-cover w-full h-full"
            />
          </div>

          {/* @ tag Username */}
          <p className="text-30-extrabold mt-7 text-center">
            @{user?.username}
          </p>

          {/* User bio */}
          <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
        </div>

        {/* Container for all startups */}
        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          {/* Startups Section Title */}
          <p className="text-30-bold">
            {session?.id === id ? "Your" : "All"} Startups
          </p>

          {/* Suspense grid with all startups */}
          <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartups id={id} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Page;
