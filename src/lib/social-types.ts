/**
 * Social feed types (pack 11). The zod schemas used by the GitHub Action live in scripts/social.types.mjs;
 * the site only imports the generated JSON, so here plain TS types are enough (no zod in the client bundle).
 */
export type Channel = "instagram" | "facebook" | "linkedin";

export interface SocialPost {
  id: string;
  channel: Channel;
  url: string;
  text: string;
  date: string;
  image: { src: string; width: number; height: number; alt: string } | null;
  kind: "image" | "video" | "carousel" | "text" | "article";
}

export interface SocialFeed {
  updatedAt: string;
  posts: SocialPost[];
  status: Record<Channel, "ok" | "stale" | "unconfigured" | "error">;
}
