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
    <form
      className="space-y-5 rounded-xl border border-brand-200 bg-brand-50/40 p-4 sm:p-5"
      onSubmit={handleSubmit}
    >
      <div>
        <label
          htmlFor={`${formId}-feedback`}
          className="block text-sm font-semibold text-brand-900"
        >
          Σχόλια διόρθωσης
        </label>

        <p
          id={`${formId}-feedback-help`}
          className="mt-1 text-xs leading-5 text-slate-500"
        >
          Τα σχόλια θα εμφανιστούν στον μαθητή μετά την αποθήκευση.
        </p>

        <textarea
          id={`${formId}-feedback`}
          rows={5}
          required
          maxLength={10000}
          disabled={submitting}
          aria-describedby={`${formId}-feedback-help`}
          placeholder="Σημείωσε παρατηρήσεις και οδηγίες για τη συνέχεια."
          value={feedback}
          onChange={(event) => {
            setFeedback(event.target.value);
            setSuccess(false);
          }}
          className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm leading-7 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
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
          Η διόρθωση αποθηκεύτηκε.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Αποθήκευση…" : "Αποθήκευση διόρθωσης"}
      </button>
    </form>
  );
}