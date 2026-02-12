import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let cachedBaseUrl: string | null = null;

export const getBaseUrl = () => {
  if (cachedBaseUrl) {
    return cachedBaseUrl;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    cachedBaseUrl = siteUrl;
    return cachedBaseUrl;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    cachedBaseUrl = vercelUrl.startsWith("http")
      ? vercelUrl
      : `https://${vercelUrl}`;
    return cachedBaseUrl;
  }

  cachedBaseUrl = "http://localhost:3000";
  return cachedBaseUrl;
};
