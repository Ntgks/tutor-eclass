"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import { changePassword } from "@/lib/auth";

export default function ChangePasswordForm() {
  const formId = useId();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Οι νέοι κωδικοί δεν ταιριάζουν.");
      return;
    }

    if (newPassword.length < 12 || newPassword.length > 64) {
      setError("Ο νέος κωδικός πρέπει να έχει 12–64 χαρακτήρες.");
      return;
    }

    const encoder = new TextEncoder();

    if (
      encoder.encode(currentPassword).length > 72 ||
      encoder.encode(newPassword).length > 72
    ) {
      setError("Κάθε κωδικός πρέπει να είναι έως 72 bytes.");
      return;
    }

    setSubmitting(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
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
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={`${formId}-current`}
          className="block text-sm font-medium text-slate-700"
        >
          Τωρινός κωδικός
        </label>

        <input
          id={`${formId}-current`}
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          maxLength={64}
          disabled={submitting}
          value={currentPassword}
          onChange={(event) => {
            setCurrentPassword(event.target.value);
            setSuccess(false);
          }}
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-new`}
          className="block text-sm font-medium text-slate-700"
        >
          Νέος κωδικός
        </label>

        <input
          id={`${formId}-new`}
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={64}
          disabled={submitting}
          aria-describedby={`${formId}-password-help`}
          value={newPassword}
          onChange={(event) => {
            setNewPassword(event.target.value);
            setSuccess(false);
          }}
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
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={64}
          disabled={submitting}
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setSuccess(false);
          }}
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

      {success && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800"
        >
          Ο κωδικός άλλαξε επιτυχώς. Στην επόμενη σύνδεση
          χρησιμοποίησε τον νέο κωδικό.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Αποθήκευση…" : "Αλλαγή κωδικού"}
      </button>
    </form>
  );
}