"use client";

import { useState } from "react";

import { createInvitation } from "@/lib/invitations";

interface InvitationButtonProps{
    studentId: string;
}

export default function InvitationButton({
    studentId,
}: InvitationButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activationUrl, setActivationUrl] = useState<string | null>(null);

    async function handleCreateInvitation() {
        if (loading) return;

        setLoading(true);
        setError(null);
        setActivationUrl(null);

        try{
            const invitation = await createInvitation(studentId);
            setActivationUrl(invitation.activationUrl);
        } catch (error){
            setError(
                error instanceof Error
                    ? error.message
                    : "Παρουσιάστηκε σφάλμα."
            );
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="mt-3 space-y-3">
            <button 
                type="button"
                onClick={handleCreateInvitation}
                disabled={loading}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
            >
                {loading ? "Δημιουργία…" : "Δημιουργία πρόσκλησης"}
            </button>

            {error && (
                <p role="alert" className="text-sm text-red-700">
                    {error}
                </p>
            )}

            {activationUrl && (
                <div className="space-y-2">
                    <p role="status" className="text-sm text-green-700">
                        Η πρόσκληση δημιουργήθηκε. Δεν έχει σταλεί email.
                    </p>

                    <label 
                        htmlFor={`invitation-${studentId}`}
                        className="block text-sm font-medium"
                    >
                        Σύνδεσμος ενεργοποίησης — ισχύει για 24 ώρες
                    </label>

                    <input
                        id={`invitation-${studentId}`}
                        type="text"
                        readOnly
                        value={activationUrl}
                        onFocus={(event) => event.currentTarget.select()}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
                    />
                </div>
            )}
        </div>
    );
}