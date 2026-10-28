"use client";

import { useState } from "react";

import type { FormEvent } from "react";
import { createStudent } from "@/lib/students";

interface CreateStudentFormProps{
    onCreated?: () => void;
}

export default function CreateStudentForm({
    onCreated,
    }: CreateStudentFormProps){
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [educationLevel, setEducationLevel] = useState("");

    const[submitting, setSubmitting] = useState(false);
    const[error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if(submitting) return;

        setError(null);
        setSuccess(null);

        if(!fullName.trim()){
            setError("Συμπλήρωσε το ονοματεπώνυμο.");
            return;
        }

        setSubmitting(true);

        try{
            await createStudent({
                fullName: fullName.trim(),
                email: email.trim(),
                educationLevel: educationLevel.trim() || null,
            });

            setFullName("");
            setEmail("");
            setEducationLevel("");
            setSuccess("Ο μαθητής δημιουργήθηκε. Η πρόσκληση δεν έχει σταλεί ακόμη.");

            onCreated?.();
        }catch(error){
            setError(
                error instanceof Error
                ? error.message
                : "Παρουσιάστηκε σφάλμα."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return(
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium">
                    Ονοματεπώνυμο
                </label>
                <input
                    id="fullName"
                    type="text"
                    required
                    maxLength={200}
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    maxLength={320}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2"
                />
            </div>

            <div>
                <label htmlFor="educationLevel" className="block text-sm font-medium">
                    Τάξη / επίπεδο σπουδών — προαιρετικό
                </label>
                <input
                    id="educationLevel"
                    type="text"
                    maxLength={100}
                    value={educationLevel}
                    onChange={(event) => setEducationLevel(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2"
                />
            </div>
            {error && (
                <p role="alert" className="text-sm text-red-700">
                    {error}
                </p>
            )}

            {success && (
                <p role="status" className="text-sm text-green-700">
                    {success}
                </p>
            )}

            <button 
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
            >
                {submitting ? "Αποθήκευση…" : "Δημιουργία μαθητή"}
            </button>
        </form>
    );
}