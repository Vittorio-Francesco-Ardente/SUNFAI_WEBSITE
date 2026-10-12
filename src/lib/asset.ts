/** Prefix a public asset path with the base path (GitHub Pages project sites live under /<repo>/). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sun-fai.org";
export const asset = (path: string) => `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
/** Absolute URL for canonical / Open Graph / hreflang. */
export const absoluteUrl = (path: string) => `${SITE_URL}${BASE_PATH}${path}`;
