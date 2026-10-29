"use client";

import { useState } from "react";

import { logout } from "@/lib/auth";

export default function LogoutButton(){
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogout(){
        if(submitting) return;

        setSubmitting(true);
        setError(null);

        try{
            await logout();
            window.location.replace("/login");
        }catch (error){
            setError(
                error instanceof Error
                    ? error.message
                    : "Παρουσιάστηκε σφάλμα."
            );

            setSubmitting(false);
        }
    }

    return(
        <div>
            <button 
                type="button"
                onClick={handleLogout}
                disabled={submitting}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-60"
            >
                {submitting ? "Αποσύνδεση…" : "Αποσύνδεση"}
            </button>

            {error && (
                <p role="alert" className="mt-2 text-sm text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}