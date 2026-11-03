"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import { activateAccount } from "@/lib/activation";

interface ActivationFormProps {
  token: string;
}

export default function ActivationForm({
  token,
}: ActivationFormProps) {
  const formId = useId();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || activated) return;

    setError(null);

    if (password !== confirmPassword) {
      setError("Οι κωδικοί δεν ταιριάζουν.");
      return;
    }

    if (new TextEncoder().encode(password).length > 72) {
      setError(
        "Ο κωδικός είναι πολύ μεγάλος. Χρησιμοποίησε λιγότερους χαρακτήρες."
      );
      return;
    }

    setSubmitting(true);

    try {
      await activateAccount({ token, password });

      setPassword("");
      setConfirmPassword("");
      setActivated(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Παρουσιάστηκε σφάλμα."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (activated) {
    return (
      <div className="space-y-5">
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-800"
        >
          <p className="font-semibold">
            Ο λογαριασμός σου ενεργοποιήθηκε.
          </p>

          <p className="mt-1">
            Μπορείς πλέον να συνδεθείς με το email σου και
            τον κωδικό που μόλις όρισες.
          </p>
        </div>

        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          Μετάβαση στη σύνδεση
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  const inputClassName =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={`${formId}-password`}
          className="block text-sm font-medium text-slate-700"
        >
          Νέος κωδικός
        </label>

        <input
          id={`${formId}-password`}
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={64}
          disabled={submitting}
          aria-describedby={`${formId}-password-help`}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClassName}
        />

        <p
          id={`${formId}-password-help`}
          className="mt-2 text-xs leading-6 text-slate-500"
        >
          Χρησιμοποίησε 12–64 χαρακτήρες, έως 72 bytes συνολικά.
          Το όριο μπορεί να συμπληρωθεί νωρίτερα με ελληνικά
          ή άλλους πολυ-byte χαρακτήρες.
        </p>
      </div>

      <div>
        <label
          htmlFor={`${formId}-confirm`}
          className="block text-sm font-medium text-slate-700"
        >
          Επιβεβαίωση κωδικού
        </label>

        <input
          id={`${formId}-confirm`}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={64}
          disabled={submitting}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className={inputClassName}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Ενεργοποίηση…" : "Ενεργοποίηση λογαριασμού"}
      </button>
    </form>
  );
}