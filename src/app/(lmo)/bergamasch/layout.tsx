import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../../globals.css";
import { RootDocument } from "@/components/layout/RootDocument";
import { getDict } from "@/content/dict";
import { SITE_URL } from "@/lib/asset";

const d = getDict("lmo");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: d.common.meta.siteTitle, template: d.common.meta.titleTemplate },
  description: d.common.meta.description,
  applicationName: "SUN-FAI",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#FAF7F0",
  colorScheme: "light",
};

/** Bergamasque root layout: <html lang="lmo">, same page components with locale="lmo". */
export default function BergamasqueRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="lmo">{children}</RootDocument>;
}
