/**
 * Real SSR-owned host for the SUN-FAI P02 canvas animation.
 * The engine is initialized from RootDocument's inline head script,
 * before Next.js hydration; it only modifies its shadow root.
 */
export function Loader({ tagline: _tagline }: { tagline: string }) {
  return <div id="sf-loader" aria-hidden="true" suppressHydrationWarning />;
}
