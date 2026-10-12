"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { cn } from "@/lib/cn";
import { lhref, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content/dict";

/** FormSubmit AJAX endpoint (static-friendly). TODO_SUNFAI: activate the address once, or switch to Formspree/Resend. */
const ENDPOINT = (email: string) => `https://formsubmit.co/ajax/${email}`;

type Errors = Partial<Record<"name" | "email" | "message" | "privacy", string>>;

/**
 * Contact form (demo, V2): client-side submission (no server on GitHub Pages) with a mailto: fallback.
 * Labels above fields, inputs ≥ 16 px / 48 px, inline errors linked via aria-describedby, first error focused.
 */
export function ContactForm({ t, email, locale, defaultTopic }: { t: Dict["pages"]["contatti"]["form"]; email: string; locale: Locale; defaultTopic?: number }) {
  const [topic, setTopic] = useState(t.topics[defaultTopic ?? 0]);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "ok" | "fallback">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = {
      name: String(f.get("nome") ?? "").trim(),
      email: String(f.get("email") ?? "").trim(),
      comune: String(f.get("comune") ?? "").trim(),
      message: String(f.get("messaggio") ?? "").trim(),
      privacy: f.get("privacy") === "on",
    };
    const errs: Errors = {};
    if (!v.name) errs.name = t.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errs.email = t.errors.email;
    if (!v.message) errs.message = t.errors.message;
    if (!v.privacy) errs.privacy = t.errors.privacy;
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setState("sending");
    const subject = t.mailSubject.replace("{topic}", topic);
    try {
      const res = await fetch(ENDPOINT(email), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _subject: subject, _template: "table", _captcha: "false", argomento: topic, nome: v.name, email: v.email, comune: v.comune, messaggio: v.message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("ok");
      formRef.current?.reset();
    } catch {
      const body = [v.message, "", "—", `${t.name}: ${v.name}`, `${t.email}: ${v.email}`, v.comune ? `${t.comune}: ${v.comune}` : null].filter(Boolean).join("\n");
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setState("fallback");
    }
  };

  const field = "mt-2 block w-full rounded-2xl bg-card px-4 py-3 text-[16px] text-ink shadow-[inset_0_0_0_1.5px_rgb(5_42_34/.16)] outline-none transition-shadow placeholder:text-ink/40 focus:shadow-[inset_0_0_0_2px_var(--color-ink)] aria-[invalid=true]:shadow-[inset_0_0_0_2px_var(--color-orange-text)]";
  const err = (k: keyof Errors) => (errors[k] ? <span id={`err-${k}`} className="mt-1.5 block text-[14px] font-medium text-orange-text">{errors[k]}</span> : null);
  const [before, after] = t.privacy.split("{link}");

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-6">
      <fieldset>
        <legend className="text-[15px] font-semibold text-ink">{t.topic}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {t.topics.map((x) => (
            <label key={x} className={cn("chip cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus-ring)]", topic === x && "!bg-ink !text-white !shadow-none")}>
              <input type="radio" name="argomento" value={x} checked={topic === x} onChange={() => setTopic(x)} className="sr-only text-[16px]" data-hit-area />
              {x}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-[15px] font-semibold text-ink">
          {t.name}
          <input data-field="name" name="nome" autoComplete="name" enterKeyHint="next" className={field} placeholder={t.namePh} aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} />
          {err("name")}
        </label>
        <label className="text-[15px] font-semibold text-ink">
          {t.email}
          <input data-field="email" name="email" type="email" inputMode="email" autoComplete="email" enterKeyHint="next" className={field} placeholder={t.emailPh} aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} />
          {err("email")}
        </label>
      </div>
      <label className="text-[15px] font-semibold text-ink">
        {t.comune} <span className="font-normal text-slate">{t.optional}</span>
        <input name="comune" autoComplete="address-level2" enterKeyHint="next" className={field} placeholder={t.comunePh} />
      </label>
      <label className="text-[15px] font-semibold text-ink">
        {t.message}
        <textarea data-field="message" name="messaggio" rows={5} enterKeyHint="send" className={cn(field, "resize-y")} placeholder={t.messagePh} aria-invalid={!!errors.message} aria-describedby={errors.message ? "err-message" : undefined} />
        {err("message")}
      </label>
      <div>
        <label className="flex min-h-11 items-start gap-3 text-[15px] text-slate">
          <input data-field="privacy" data-hit-area type="checkbox" name="privacy" className="mt-0.5 size-6 shrink-0 text-[16px] accent-[var(--color-orange-btn)]" aria-invalid={!!errors.privacy} aria-describedby={errors.privacy ? "err-privacy" : undefined} />
          <span>
            {before}
            <Link href={lhref(locale, "/note-legali/")} className="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-leaf decoration-2 underline-offset-4">
              {t.privacyLink}
            </Link>
            {after}
          </span>
        </label>
        {err("privacy")}
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <button type="submit" className="btn btn--primary btn--lg" disabled={state === "sending"}>
          {state === "sending" ? t.sending : t.submit}
          <Send aria-hidden />
        </button>
        <p className="text-[15px] text-slate" aria-live="polite">
          {state === "ok" ? t.success : state === "fallback" ? t.fallback : ""}
        </p>
      </div>
    </form>
  );
}
