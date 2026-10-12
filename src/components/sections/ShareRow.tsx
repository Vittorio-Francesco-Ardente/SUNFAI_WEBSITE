"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { LinkedinIcon } from "@/components/ui/SocialIcons";

/** Share buttons in one row (44 px): native share when available, LinkedIn, copy link. No third-party scripts. */
export function ShareRow({ url, title, labels }: { url: string; title: string; labels: { share: string; copy: string; copied: string } }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare("share" in navigator), []);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {canShare ? (
        <button type="button" className="btn btn--outline btn--sm" onClick={() => navigator.share({ title, url }).catch(() => {})}>
          <Share2 aria-hidden />
          {labels.share}
        </button>
      ) : null}
      <a className="paper-round" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <LinkedinIcon className="size-[18px]" />
      </a>
      <button
        type="button"
        className="btn btn--outline btn--sm"
        onClick={() =>
          navigator.clipboard
            ?.writeText(url)
            .then(() => (setCopied(true), setTimeout(() => setCopied(false), 2000)))
            .catch(() => {})
        }
      >
        {copied ? <Check aria-hidden /> : <Link2 aria-hidden />}
        <span aria-live="polite">{copied ? labels.copied : labels.copy}</span>
      </button>
    </div>
  );
}
