#!/usr/bin/env node
/**
 * Build-time social feed (pack 11). Run by .github/workflows/social-refresh.yml every 6 h (and by hand).
 * Calls the official APIs, validates with zod, DOWNLOADS images into public/social/ (960 px WebP, never expiring CDN
 * URLs) and writes src/content/social-feed.json (max 6 posts, max 2 per channel, newest first).
 * A provider that fails or is not configured keeps its previous posts and is marked "stale" / "unconfigured".
 * Verify the endpoints against the current official docs before enabling a provider.
 *
 * Secrets:   INSTAGRAM_ACCESS_TOKEN · FACEBOOK_PAGE_ACCESS_TOKEN · LINKEDIN_ACCESS_TOKEN
 * Variables: META_GRAPH_VERSION · FACEBOOK_PAGE_ID · LINKEDIN_ORGANIZATION_URN · LINKEDIN_VERSION · LINKEDIN_FEED_URL
 * Manual fallback: src/content/social-manual.json (same SocialPost shape), edited by SUN-FAI.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { SocialFeed, SocialPost } from "./social.types.mjs";

const ROOT = process.cwd();
const FEED = path.join(ROOT, "src/content/social-feed.json");
const MANUAL = path.join(ROOT, "src/content/social-manual.json");
const IMG_DIR = path.join(ROOT, "public/social");
const env = process.env;
const prev = fs.existsSync(FEED) ? SocialFeed.parse(JSON.parse(fs.readFileSync(FEED, "utf8"))) : { updatedAt: "", posts: [], status: {} };
fs.mkdirSync(IMG_DIR, { recursive: true });

const clean = (s = "") => s.replace(/@\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\s+/g, " ").trim();
const excerpt = (s) => (s.length > 600 ? `${s.slice(0, 597)}…` : s);

async function getJson(url, headers = {}) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${url.replace(/access_token=[^&]+/, "access_token=***")}`);
  return res.json();
}

/** Download + resize to 960 px WebP; returns the local image record. */
async function saveImage(url, id, alt) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const file = `${id.replace(/[^a-z0-9_-]/gi, "_")}.webp`;
  const out = path.join(IMG_DIR, file);
  const info = await sharp(buf).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
  return { src: `/social/${file}`, width: info.width, height: info.height, alt };
}

const providers = {
  instagram: {
    configured: () => !!env.INSTAGRAM_ACCESS_TOKEN,
    async fetch(limit) {
      const tok = env.INSTAGRAM_ACCESS_TOKEN;
      const data = await getJson(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}&access_token=${tok}`);
      const out = [];
      for (const m of data.data ?? []) {
        const imgUrl = m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url;
        const text = excerpt(clean(m.caption));
        out.push({
          id: `ig_${m.id}`,
          channel: "instagram",
          url: m.permalink,
          text,
          date: m.timestamp,
          image: imgUrl ? await saveImage(imgUrl, `ig_${m.id}`, text.slice(0, 120) || "Post Instagram di SUN-FAI") : null,
          kind: m.media_type === "VIDEO" ? "video" : m.media_type === "CAROUSEL_ALBUM" ? "carousel" : "image",
        });
      }
      return out;
    },
  },
  facebook: {
    configured: () => !!(env.FACEBOOK_PAGE_ACCESS_TOKEN && env.FACEBOOK_PAGE_ID),
    async fetch(limit) {
      const v = env.META_GRAPH_VERSION || "v21.0";
      const data = await getJson(`https://graph.facebook.com/${v}/${env.FACEBOOK_PAGE_ID}/posts?fields=id,message,created_time,permalink_url,full_picture&limit=${limit}&access_token=${env.FACEBOOK_PAGE_ACCESS_TOKEN}`);
      const out = [];
      for (const p of data.data ?? []) {
        const text = excerpt(clean(p.message));
        out.push({
          id: `fb_${p.id}`,
          channel: "facebook",
          url: p.permalink_url,
          text,
          date: p.created_time,
          image: p.full_picture ? await saveImage(p.full_picture, `fb_${p.id}`, text.slice(0, 120) || "Post Facebook di SUN-FAI") : null,
          kind: p.full_picture ? "image" : "text",
        });
      }
      return out;
    },
  },
  linkedin: {
    configured: () => !!((env.LINKEDIN_ACCESS_TOKEN && env.LINKEDIN_ORGANIZATION_URN) || env.LINKEDIN_FEED_URL),
    async fetch(limit) {
      if (!env.LINKEDIN_ACCESS_TOKEN && env.LINKEDIN_FEED_URL) {
        // automation fallback (Make/Zapier) → JSON array of SocialPost-like objects
        const items = await getJson(env.LINKEDIN_FEED_URL);
        return (Array.isArray(items) ? items : items.posts ?? []).slice(0, limit).map((p) => ({ ...p, channel: "linkedin", image: null, kind: p.kind ?? "text" }));
      }
      const headers = { Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`, "LinkedIn-Version": env.LINKEDIN_VERSION || "202501", "X-Restli-Protocol-Version": "2.0.0" };
      const urn = encodeURIComponent(env.LINKEDIN_ORGANIZATION_URN);
      const data = await getJson(`https://api.linkedin.com/rest/posts?author=${urn}&q=author&count=10&sortBy=LAST_MODIFIED`, headers);
      const out = [];
      for (const p of data.elements ?? []) {
        if (p.visibility !== "PUBLIC" || (p.reshareContext && !p.commentary)) continue;
        const text = excerpt(clean(p.commentary));
        let image = null;
        const imgUrn = p.content?.media?.id;
        if (imgUrn?.startsWith("urn:li:image:")) {
          const img = await getJson(`https://api.linkedin.com/rest/images/${encodeURIComponent(imgUrn)}`, headers);
          if (img.downloadUrl) image = await saveImage(img.downloadUrl, `li_${p.id}`, text.slice(0, 120) || "Post LinkedIn di SUN-FAI");
        }
        out.push({ id: `li_${p.id}`, channel: "linkedin", url: `https://www.linkedin.com/feed/update/${p.id}/`, text, date: new Date(p.publishedAt ?? p.createdAt).toISOString(), image, kind: image ? "image" : "text" });
        if (out.length >= limit) break;
      }
      return out;
    },
  },
};

const status = {};
let posts = [];
for (const [channel, prov] of Object.entries(providers)) {
  const old = prev.posts.filter((p) => p.channel === channel);
  if (!prov.configured()) {
    status[channel] = "unconfigured";
    posts.push(...old);
    continue;
  }
  try {
    const fresh = (await prov.fetch(6)).map((p) => SocialPost.parse(p));
    posts.push(...fresh);
    status[channel] = "ok";
  } catch (e) {
    console.warn(`[social] ${channel}: ${e.message} — keeping the previous posts`);
    status[channel] = old.length ? "stale" : "error";
    posts.push(...old);
  }
}
if (fs.existsSync(MANUAL)) posts.push(...JSON.parse(fs.readFileSync(MANUAL, "utf8")).map((p) => SocialPost.parse(p)));

// newest first, max 2 per channel, max 6 total, de-duplicated
const seen = new Set();
const per = {};
posts = posts
  .sort((a, b) => b.date.localeCompare(a.date))
  .filter((p) => !seen.has(p.id) && seen.add(p.id) && (per[p.channel] = (per[p.channel] ?? 0) + 1) <= 2)
  .slice(0, 6);

const next = SocialFeed.parse({ updatedAt: new Date().toISOString(), posts, status });
const same = JSON.stringify({ ...next, updatedAt: "" }) === JSON.stringify({ ...prev, updatedAt: "" });
if (!same) {
  fs.writeFileSync(FEED, JSON.stringify(next, null, 2) + "\n");
  // remove images no longer referenced
  const keep = new Set(posts.map((p) => p.image?.src.replace("/social/", "")).filter(Boolean));
  for (const f of fs.readdirSync(IMG_DIR)) if (!keep.has(f) && f !== ".gitkeep") fs.rmSync(path.join(IMG_DIR, f));
}
console.log(`[social] ${posts.length} posts · ${JSON.stringify(status)} · ${same ? "no changes" : "feed updated"}`);
