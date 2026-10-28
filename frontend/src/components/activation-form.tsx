"use client";

import { useState } from "react";

import type { FormEvent } from "react";

import { activateAccount } from "@/lib/activation";

interface ActivationFormProps {
  token: string;
}

export default function ActivationForm({
  token,
}: ActivationFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();

    if(submitting || activated) return;

    setError(null);

    if(password !== confirmPassword){
        setError("Οι κωδικοί δεν ταιριάζουν.");
        return;
    }

    if(new TextEncoder().encode(password).length > 72){
        setError("Ο κωδικός υπερβαίνει το όριο των 72 bytes.");
        return;
    }

    setSubmitting(true);

    try{
        await activateAccount({token, password});

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

  if(activated){
    return(
        <p role="status" className="text-green-700">
            Ο λογαριασμός σου ενεργοποιήθηκε. Μπορείς πλέον να συνδεθείς.
        </p>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Νέος κωδικός
        </label>

        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={64}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 p-2"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium"
        >
          Επιβεβαίωση κωδικού
        </label>

        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={64}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 p-2"
        />
      </div>

      <p className="text-sm text-slate-600">
        Χρησιμοποίησε 12–64 χαρακτήρες, έως 72 bytes συνολικά.
      </p>

      {error && (
        <p role="alert" className="text-sm text-red-700">
            {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
        >
            {submitting ? "Ενεργοποίηση…" : "Ενεργοποίηση λογαριασμού"}
        </button>
    </form>
  );
}