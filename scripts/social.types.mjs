/** zod schemas for the build-time social feed (port of pack 11 code/social.types.ts for the Node script). */
import { z } from "zod";

export const Channel = z.enum(["instagram", "facebook", "linkedin"]);

export const SocialPost = z.object({
  id: z.string(),
  channel: Channel,
  url: z.string().url(), // permalink to the original post
  text: z.string().default(""), // caption / commentary (plain text, trimmed)
  date: z.string(), // ISO 8601
  image: z
    .object({
      src: z.string(), // path under /public/social/ (downloaded at build) — never the expiring CDN URL
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      alt: z.string(),
    })
    .nullable(),
  kind: z.enum(["image", "video", "carousel", "text", "article"]),
});

export const SocialFeed = z.object({
  updatedAt: z.string(),
  posts: z.array(SocialPost),
  status: z.record(Channel, z.enum(["ok", "stale", "unconfigured", "error"])).or(z.object({})),
});
