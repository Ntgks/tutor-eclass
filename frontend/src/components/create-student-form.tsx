"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import { createStudent } from "@/lib/students";

interface CreateStudentFormProps {
  onCreated?: () => void;
}

export default function CreateStudentForm({
  onCreated,
}: CreateStudentFormProps) {
  const formId = useId();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setError(null);
    setSuccess(null);

    if (!fullName.trim()) {
      setError("Συμπλήρωσε το ονοματεπώνυμο.");
      return;
    }

    setSubmitting(true);

    try {
      await createStudent({
        fullName: fullName.trim(),
        email: email.trim(),
        educationLevel: educationLevel.trim() || null,
      });

      setFullName("");
      setEmail("");
      setEducationLevel("");
      setSuccess(
        "Ο μαθητής δημιουργήθηκε. Η πρόσκληση δεν έχει σταλεί ακόμη."
      );

      onCreated?.();
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
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={`${formId}-name`}
          className="block text-sm font-medium text-slate-700"
        >
          Ονοματεπώνυμο
        </label>

        <input
          id={`${formId}-name`}
          type="text"
          autoComplete="name"
          required
          maxLength={200}
          placeholder="π.χ. Μαρία Παπαδοπούλου"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-email`}
          className="block text-sm font-medium text-slate-700"
        >
          Email
        </label>

        <input
          id={`${formId}-email`}
          type="email"
          autoComplete="email"
          required
          maxLength={320}
          placeholder="student@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-level`}
          className="block text-sm font-medium text-slate-700"
        >
          Τάξη / επίπεδο σπουδών
          <span className="ml-1 font-normal text-slate-400">
            (προαιρετικό)
          </span>
        </label>

        <input
          id={`${formId}-level`}
          type="text"
          maxLength={100}
          placeholder="π.χ. Β΄ Γυμνασίου"
          value={educationLevel}
          onChange={(event) => setEducationLevel(event.target.value)}
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
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Αποθήκευση…" : "Δημιουργία μαθητή"}
      </button>
    </form>
  );
}