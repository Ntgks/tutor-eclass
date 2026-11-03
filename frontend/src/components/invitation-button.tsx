"use client";

import { useState } from "react";

import { createInvitation } from "@/lib/invitations";

interface InvitationButtonProps {
  studentId: string;
}

export default function InvitationButton({
  studentId,
}: InvitationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activationUrl, setActivationUrl] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);

  async function handleCreateInvitation() {
    if (loading) return;

    setLoading(true);
    setError(null);
    setActivationUrl(null);
    setEmailSent(null);

    try {
      const invitation = await createInvitation(studentId);

      setActivationUrl(invitation.activationUrl);
      setEmailSent(invitation.emailSent);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Παρουσιάστηκε σφάλμα."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-w-0 space-y-3">
      <button
        type="button"
        onClick={handleCreateInvitation}
        disabled={loading}
        className="rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Αποστολή…" : "Αποστολή πρόσκλησης"}
      </button>

      {error && (
        <p role="alert" className="text-sm leading-6 text-red-700">
          {error}
        </p>
      )}

      {activationUrl && (
        <div className="space-y-3 rounded-xl border border-brand-200 bg-brand-50/50 p-4">
          {emailSent === true ? (
            <p
              role="status"
              className="text-sm leading-6 text-emerald-800"
            >
              Η πρόσκληση δημιουργήθηκε και το μήνυμα έγινε δεκτό
              από τον διακομιστή email.
            </p>
          ) : (
            <p
              role="alert"
              className="text-sm leading-6 text-amber-800"
            >
              Η πρόσκληση δημιουργήθηκε, αλλά η αποστολή email
              δεν επιβεβαιώθηκε. Μπορείς να αντιγράψεις τον παρακάτω
              σύνδεσμο και να τον δώσεις στον μαθητή.
            </p>
          )}

          <div>
            <label
              htmlFor={`invitation-${studentId}`}
              className="block text-sm font-medium text-brand-900"
            >
              Σύνδεσμος ενεργοποίησης
            </label>

            <input
              id={`invitation-${studentId}`}
              type="text"
              readOnly
              value={activationUrl}
              aria-describedby={`invitation-help-${studentId}`}
              onFocus={(event) => event.currentTarget.select()}
              className="mt-2 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />

            <p
              id={`invitation-help-${studentId}`}
              className="mt-2 text-xs leading-5 text-slate-500"
            >
              Ισχύει για 24 ώρες. Πάτησε στο πεδίο για να επιλέξεις
              τον σύνδεσμο.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}