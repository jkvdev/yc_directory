import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind CSS Classname Generator
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatting Dates
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Parse Server Action Response
export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response));
}
