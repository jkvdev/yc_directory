import "server-only";

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, token } from "../env";

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

// Safety check to ensure that the write token is set
if (!writeClient.config().token) {
  throw new Error("Write token not found.");
}
