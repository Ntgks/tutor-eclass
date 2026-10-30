"use client";

import { useId, useState } from "react";

import type { FormEvent } from "react";
import { reviewSubmission } from "@/lib/submissions";

interface ReviewSubmissionFormProps {
  courseId: string;
  assignmentId: string;
  initialFeedback?: string;
  onReviewed?: () => void;
}

export default function ReviewSubmissionForm({
  courseId,
  assignmentId,
  initialFeedback = "",
  onReviewed,
}: ReviewSubmissionFormProps) {
  const formId = useId();
  const [feedback, setFeedback] = useState(initialFeedback);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setError(null);
    setSuccess(false);

    if (!feedback.trim()) {
        setError("Συμπλήρωσε τα σχόλια διόρθωσης.");
        return;
    }

    setSubmitting(true);

    try {
        await reviewSubmission(courseId, assignmentId, {
        feedback: feedback.trim(),
        });

        setSuccess(true);
        onReviewed?.();
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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={`${formId}-feedback`}
          className="block text-sm font-medium"
        >
          Σχόλια διόρθωσης
        </label>

        <textarea
          id={`${formId}-feedback`}
          rows={5}
          required
          maxLength={10000}
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
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
            Η διόρθωση αποθηκεύτηκε.
        </p>
      )}

      <button 
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Αποθήκευση…" : "Αποθήκευση διόρθωσης"}
      </button>
    </form>
  );
}