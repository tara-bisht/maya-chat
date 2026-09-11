"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  DISPLAY_NAME_MAX,
  GLOBAL_BIO_MAX,
  LANGUAGE_PRESETS,
  type SettingsView,
} from "@maya/shared";
import { updateProfile } from "@/app/(app)/settings/actions";

function seatStatusLabel(status: SettingsView["seat"]["status"]) {
  if (status === "past_due") {
    return "past due";
  }
  return status;
}

export function SettingsForm({ view }: { view: SettingsView }) {
  const [state, action, pending] = useActionState(updateProfile, null);
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const formError = state && !state.ok ? state.formError : undefined;

  return (
    <form action={action} className="flex flex-col gap-6">
      {view.email ? (
        <p className="font-mono text-sm text-ink-soft">{view.email}</p>
      ) : null}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="displayName"
          className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase"
        >
          Name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          maxLength={DISPLAY_NAME_MAX}
          defaultValue={view.displayName}
          autoComplete="nickname"
          aria-invalid={fieldErrors?.displayName ? true : undefined}
          aria-describedby={
            fieldErrors?.displayName ? "displayName-error" : undefined
          }
          className="h-11 rounded-md bg-cream-dim px-3 font-sans text-base text-night"
        />
        {fieldErrors?.displayName ? (
          <p id="displayName-error" className="font-sans text-sm text-acid">
            {fieldErrors.displayName}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="preferredLanguage"
          className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase"
        >
          Language
        </label>
        <select
          id="preferredLanguage"
          name="preferredLanguage"
          defaultValue={view.preferredLanguage}
          aria-invalid={fieldErrors?.preferredLanguage ? true : undefined}
          aria-describedby={
            fieldErrors?.preferredLanguage
              ? "preferredLanguage-error"
              : undefined
          }
          className="h-11 rounded-md bg-cream-dim px-3 font-sans text-base text-night"
        >
          {LANGUAGE_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
        {fieldErrors?.preferredLanguage ? (
          <p
            id="preferredLanguage-error"
            className="font-sans text-sm text-acid"
          >
            {fieldErrors.preferredLanguage}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="globalBio"
          className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase"
        >
          Bio
        </label>
        <textarea
          id="globalBio"
          name="globalBio"
          rows={4}
          maxLength={GLOBAL_BIO_MAX}
          defaultValue={view.globalBio}
          aria-invalid={fieldErrors?.globalBio ? true : undefined}
          aria-describedby={
            fieldErrors?.globalBio
              ? "globalBio-help globalBio-error"
              : "globalBio-help"
          }
          className="rounded-md bg-cream-dim px-3 py-3 font-sans text-base leading-snug text-night"
        />
        <p id="globalBio-help" className="font-sans text-sm text-ink-soft">
          500 characters. What they should already know about you.
        </p>
        {fieldErrors?.globalBio ? (
          <p id="globalBio-error" className="font-sans text-sm text-acid">
            {fieldErrors.globalBio}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p className="font-sans text-sm text-acid" role="alert">
          {formError}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded-md bg-acid px-5 font-sans text-sm font-semibold text-on-acid shadow-[4px_4px_0_#F6EFE4] hover:bg-acid-hover disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>

      <section className="border-t border-rule pt-6">
        <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
          Plan
        </p>
        <p className="mt-2 font-display text-2xl text-cream italic">
          {view.seat.displayName} · {seatStatusLabel(view.seat.status)}
        </p>
        <p className="mt-3">
          <Link
            href={view.bill.href}
            className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
          >
            {view.seat.planId === "free" ? "Upgrade" : "Manage plan"}
          </Link>
        </p>
      </section>
    </form>
  );
}
