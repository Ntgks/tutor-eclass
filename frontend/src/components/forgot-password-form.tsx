"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import { forgotPassword } from "@/lib/password-reset";

export default function ForgotPasswordForm() {
  const formId = useId();

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError("Συμπλήρωσε το email σου.");
      return;
    }

    setSubmitting(true);

    try {
      await forgotPassword(email);
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

  return (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={`${formId}-email`}
          className="block text-sm font-medium text-slate-700"
        >
          Email λογαριασμού
        </label>

        <input
          id={`${formId}-email`}
          type="email"
          autoComplete="email"
          required
          maxLength={320}
          disabled={submitting}
          placeholder="name@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setSuccess(false);
          }}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
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

      {success && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800"
        >
          Αν υπάρχει ενεργός λογαριασμός με αυτό το email, θα λάβεις
          σύνδεσμο επαναφοράς κωδικού. Έλεγξε και τον φάκελο
          ανεπιθύμητης αλληλογραφίας.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Επεξεργασία…" : "Αποστολή συνδέσμου επαναφοράς"}
      </button>
    </form>
  );
}