import { asset } from "@/lib/asset";

/**
 * SUN-FAI intro loader (P02 prototype supplied by the user).
 * The actual loader is the canvas/shadow-root implementation contained in
 * `public/loader/sf-loader-p02.js`; it auto-starts unless the preflight adds
 * `html.sf-noloader`.
 */
export function Loader({ tagline: _tagline }: { tagline: string }) {
  return (
    <>
      <script src={asset("/loader/sf-loader-p02.js")} defer />
      <noscript>
        <style>{"#sf-loader{display:none!important}"}</style>
      </noscript>
    </>
  );
}
