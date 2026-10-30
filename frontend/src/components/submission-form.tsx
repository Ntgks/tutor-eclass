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

  async function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();

    if(submitting || submitted) return;

    setError(null);

    if(files.length === 0 || files.length > 5){
        setError("Επίλεξε από 1 έως 5 αρχεία.");
        return;
    }

    if(files.some((file) => file.size === 0)) {
        setError("Τα αρχεία δεν μπορούν να είναι κενά.");
        return;
    }

    if(files.some((file) => file.size > 10 * 1024 * 1024)) {
        setError("Κάθε αρχείο πρέπει να είναι έως 10 MB.");
        return;
    }

    setSubmitting(true);

    try{
        await createSubmission(
            courseId,
            assignmentId,
            { studentComment: studentComment.trim() || null},
            files
        );

        setStudentComment("");
        setFiles([]);

        if (fileInputRef.current){
            fileInputRef.current.value = "";
        }

        setSubmitted(true);
        onSubmitted?.();
    } catch (error){
        setError(
            error instanceof Error
                ? error.message
                : "Παρουσιάστηκε σφάλμα."
        );
    } finally {
        setSubmitting(false);
    }
  }

  if(submitted){
    return(
        <p role="status" className="text-green-700">
            Η υποβολή καταχωρίστηκε επιτυχώς.
        </p>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={`${formId}-files`}
          className="block text-sm font-medium"
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
          onChange={(event) =>
            setFiles(Array.from(event.target.files ?? []))
          }
          className="mt-1 block w-full text-sm"
        />

        <p className="mt-2 text-sm text-slate-600">
          Επίλεξε από 1 έως 5 αρχεία, έως 10 MB το καθένα.
        </p>
      </div>

      <div>
        <label
          htmlFor={`${formId}-comment`}
          className="block text-sm font-medium"
        >
          Σχόλιο — προαιρετικό
        </label>

        <textarea
          id={`${formId}-comment`}
          rows={3}
          maxLength={5000}
          value={studentComment}
          onChange={(event) => setStudentComment(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2"
        />
      </div>

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
        {submitting ? "Υποβολή…" : "Υποβολή εργασίας"}
      </button>
    </form>
  );
}