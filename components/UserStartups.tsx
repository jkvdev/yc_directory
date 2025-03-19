import React from "react";
import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";

const UserStartups = async ({ id }: { id: string }) => {
  // Get all startups by author
  const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id });

  return (
    <>
      {/* If there are any startups made by the author */}
      {startups.length > 0 ? (
        // Map over the startups and display them
        startups.map((startup: StartupTypeCard) => (
          <StartupCard key={startup._id} post={startup} />
        ))
      ) : (
        // If there are no startups made by the author
        <p className="no-result">No posts yet</p>
      )}
    </>
  );
};
export default UserStartups;
