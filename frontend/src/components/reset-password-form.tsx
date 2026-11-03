"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import { resetPassword } from "@/lib/password-reset";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({
  token,
}: ResetPasswordFormProps) {
  const formId = useId();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || success) return;

    setError(null);

    if (password.length < 12 || password.length > 64) {
      setError("Ο κωδικός πρέπει να έχει 12–64 χαρακτήρες.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Οι κωδικοί δεν ταιριάζουν.");
      return;
    }

    if (new TextEncoder().encode(password).length > 72) {
      setError("Ο κωδικός υπερβαίνει το όριο των 72 bytes.");
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword(token, password);

      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
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

  const inputClassName =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

  if (success) {
    return (
      <div className="mt-6 space-y-5">
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-800"
        >
          <p className="font-semibold">
            Ο κωδικός σου άλλαξε επιτυχώς.
          </p>

          <p className="mt-2">
            Μπορείς πλέον να συνδεθείς με το email σου και τον νέο
            κωδικό.
          </p>
        </div>

        <Link
          href="/login"
          className="flex justify-center rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          Μετάβαση στη σύνδεση →
        </Link>
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={`${formId}-password`}
          className="block text-sm font-medium text-slate-700"
        >
          Νέος κωδικός
        </label>

        <input
          id={`${formId}-password`}
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
          Τα ελληνικά και άλλοι χαρακτήρες μπορεί να καταλαμβάνουν
          περισσότερα από ένα byte.
        </p>
      </div>

      <div>
        <label
          htmlFor={`${formId}-confirm`}
          className="block text-sm font-medium text-slate-700"
        >
          Επιβεβαίωση νέου κωδικού
        </label>

        <input
          id={`${formId}-confirm`}
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
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
        >
          <p>{error}</p>

          <Link
            href="/forgot-password"
            className="mt-2 inline-block font-semibold underline"
          >
            Αίτημα νέου συνδέσμου
          </Link>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Αποθήκευση…" : "Αποθήκευση νέου κωδικού"}
      </button>
    </form>
  );
}