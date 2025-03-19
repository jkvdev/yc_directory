"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

// Main Server Actions
// Create Pitch
export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string
) => {
  // Get Auth Session
  const session = await auth();

  // If no Auth session, return an error
  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  // Destructure form data and only keep the pitch
  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  );

  // Generate a slug from the title
  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    // Get new startup data
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };

    // Create new startup
    const result = await writeClient.create({ _type: "startup", ...startup });

    // Return a success response
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    // Show error in the console
    console.log(error);

    // Return the error
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
