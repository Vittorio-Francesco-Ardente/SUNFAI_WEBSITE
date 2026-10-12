import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { RootDocument } from "@/components/layout/RootDocument";
import { getDict } from "@/content/dict";
import { SITE_URL } from "@/lib/asset";

const d = getDict("it");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: d.common.meta.siteTitle, template: d.common.meta.titleTemplate },
  description: d.common.meta.description,
  applicationName: "SUN-FAI",
};

/** pack 15.1 §1 — never disable zoom. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#FAF7F0",
  colorScheme: "light",
};

export default function ItalianRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="it">{children}</RootDocument>;
}
