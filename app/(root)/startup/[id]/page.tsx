// Import Dependencies
import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";

// Get sanity markdown functionality
const md = markdownit();

// Set PPR to true
export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  // Get startup id from URL Params
  const id = (await params).id;

  // Parallel requests
  const [post, { select: editorPosts }] = await Promise.all([
    // Get startup by ID
    client.fetch(STARTUP_BY_ID_QUERY, { id }),
    // Get editor picks / playlist based on preferences
    client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: "new-editor-picks",
    }),
  ]);

  // If no post found, return 404
  if (!post) return notFound();

  // Get Parsed Content from the markdown
  const parsedContent = md.render(post?.pitch || "");

  return (
    <>
      {/* Main intro section */}
      <section className="pink_container !min-h-[230px] !pb-36">
        {/* Created at date */}
        <p className="tag">{formatDate(post?._createdAt)}</p>

        {/* Startup Title */}
        <h1 className="heading">{post.title}</h1>

        {/* Startup Description */}
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      {/* Main Startup Details Section */}
      <section className="section_container">
        {/* Startup Thumbnail IMage */}
        <img
          src={post.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl -mt-24"
        />

        {/* Startup Data */}
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          {/* Author and Category */}
          <div className="flex-between gap-5">
            {/* Author Data */}
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              {/* Author Avatar */}
              <div className="overflow-hidden w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                <Image
                  src={post.author.image}
                  alt="avatar"
                  width={64}
                  height={64}
                  layout="intrinsic"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Author Name & Username */}
              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author.username}
                </p>
              </div>
            </Link>

            {/* Category */}
            <p className="category-tag">{post.category}</p>
          </div>

          {/* Pitch Details */}
          <h3 className="text-30-bold">Pitch Details</h3>

          {/* Parse and convert markup for display */}
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            // No results
            <p className="no-result">No details provided</p>
          )}
        </div>

        {/* Dotted Divider */}
        <hr className="divider" />

        {/* Editor selected startups */}
        {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            {/* Editor Picks */}
            <p className="text-30-semibold">Editor Picks</p>

            {/* Show Startups in a grid */}
            <ul className="mt-7 card_grid-sm">
              {/* Map over startups and display them */}
              {editorPosts.map((post: StartupTypeCard, i: number) => (
                <StartupCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )}

        {/* PPR: Suspense View Tag */}
        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default Page;
