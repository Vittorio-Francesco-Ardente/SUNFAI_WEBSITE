import { LinkedinIcon } from "@/components/ui/SocialIcons";
import { cn } from "@/lib/cn";

/** Shown only when the member supplied a real LinkedIn URL. */
export function MemberLinkedIn({ href, name, className }: { href?: string; name: string; className?: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Profilo LinkedIn di ${name} (si apre in una nuova scheda)`}
      title={`LinkedIn · ${name}`}
      className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-white text-[#0A66C2] shadow-[0_4px_16px_-10px_rgb(5_42_34/.5)] transition-[transform,background-color] hover:scale-105 hover:bg-[#EAF3FB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A66C2]", className)}
    >
      <LinkedinIcon className="size-[19px]" />
    </a>
  );
}
