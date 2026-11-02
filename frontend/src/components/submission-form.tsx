"use client";

import { useId, useRef, useState } from "react";
import type { FormEvent } from "react";

import { createSubmission } from "@/lib/submissions";

interface SubmissionFormProps {
  courseId: string;
  assignmentId: string;
  onSubmitted?: () => void;
}

export default function SubmissionForm({
  courseId,
  assignmentId,
  onSubmitted,
}: SubmissionFormProps) {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [studentComment, setStudentComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || submitted) return;

    setError(null);

    if (files.length === 0 || files.length > 5) {
      setError("Επίλεξε από 1 έως 5 αρχεία.");
      return;
    }

    if (files.some((file) => file.size === 0)) {
      setError("Τα αρχεία δεν μπορούν να είναι κενά.");
      return;
    }

    if (files.some((file) => file.size > 10 * 1024 * 1024)) {
      setError("Κάθε αρχείο πρέπει να είναι έως 10 MB.");
      return;
    }

    setSubmitting(true);

    try {
      await createSubmission(
        courseId,
        assignmentId,
        { studentComment: studentComment.trim() || null },
        files
      );

      setStudentComment("");
      setFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSubmitted(true);
      onSubmitted?.();
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

  if (submitted) {
    return (
      <p
        role="status"
        className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800"
      >
        Η υποβολή καταχωρίστηκε επιτυχώς.
      </p>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <p className="font-semibold text-brand-900">
          Η υποβολή σου
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Πρόσθεσε τις λύσεις σου ως φωτογραφίες ή PDF.
        </p>
      </div>

      <div>
        <label
          htmlFor={`${formId}-files`}
          className="block text-sm font-medium text-slate-700"
        >
          Φωτογραφίες ή PDF
        </label>

        <input
          id={`${formId}-files`}
          ref={fileInputRef}
          type="file"
          accept="application/pdf,image/*"
          multiple
          required
          disabled={submitting}
          aria-describedby={`${formId}-files-help`}
          onChange={(event) =>
            setFiles(Array.from(event.target.files ?? []))
          }
          className="mt-2 block w-full min-w-0 rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-600 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-60"
        />

        <p
          id={`${formId}-files-help`}
          className="mt-2 text-xs leading-5 text-slate-500"
        >
          Από 1 έως 5 αρχεία, έως 10 MB το καθένα.
        </p>

        {files.length > 0 && (
          <ul
            aria-label="Επιλεγμένα αρχεία"
            className="mt-3 space-y-2"
          >
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.lastModified}-${index}`}
                className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 rounded-lg border border-brand-900/10 bg-brand-50/50 px-3 py-2"
              >
                <span className="min-w-0 break-all text-xs font-medium text-brand-900">
                  {file.name}
                </span>

                <span className="shrink-0 text-xs text-slate-500">
                  {Math.ceil(file.size / 1024)} KB
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label
          htmlFor={`${formId}-comment`}
          className="block text-sm font-medium text-slate-700"
        >
          Σχόλιο
          <span className="ml-1 font-normal text-slate-500">
            (προαιρετικό)
          </span>
        </label>

        <textarea
          id={`${formId}-comment`}
          rows={3}
          maxLength={5000}
          disabled={submitting}
          placeholder="Υπάρχει κάτι που θέλεις να επισημάνεις;"
          value={studentComment}
          onChange={(event) => setStudentComment(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
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
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Υποβολή…" : "Υποβολή εργασίας"}
      </button>
    </form>
  );
}