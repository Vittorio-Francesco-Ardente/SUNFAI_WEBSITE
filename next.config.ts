import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages (works on any static host).
 * NEXT_PUBLIC_BASE_PATH = "/<repo>" for https://<user>.github.io/<repo>/, "" for the custom domain.
 *
 * Images: next/image optimisation needs a server, so the site never uses it. `scripts/optimize-images.mjs`
 * (sharp) pre-generates WebP widths 360…1920 at build time and `components/ui/Img.tsx` renders the srcset
 * (pack 12 allows "an equivalent sharp build step" instead of next-image-export-optimizer).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const config: NextConfig = {
  output: "export",
  trailingSlash: true, // GitHub Pages serves folder/index.html
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  // two root layouts (it / lmo) → a global 404 page (src/app/global-not-found.tsx) exported as out/404.html
  experimental: { globalNotFound: true },
};

export default config;
