import { asset } from "@/lib/asset";

/**
 * P02 SUN-FAI canvas intro (the user-provided loader prototype, not the old CSS sequence).
 * The server-rendered shell prevents the underlying page flashing before the script starts.
 * The independent canvas host is created and removed by the P02 engine, outside React.
 */
export function Loader({ tagline: _tagline }: { tagline: string }) {
  return (
    <>
      <div id="sf-loader-shell" aria-hidden="true" />
      <script src={asset("/loader/sf-loader-p02-v33.js")} defer />
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){window.addEventListener('load',function(){setTimeout(function(){if(!window.SFLoader){document.documentElement.classList.add('sf-loader-done')}},5200)},{once:true})})();",
        }}
      />
    </>
  );
}
