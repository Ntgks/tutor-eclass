"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import { createAssignment } from "@/lib/assignments";

interface CreateAssignmentFormProps {
  courseId: string;
  onCreated?: () => void;
}

export default function CreateAssignmentForm({
  courseId,
  onCreated,
}: CreateAssignmentFormProps) {
  const formId = useId();

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Συμπλήρωσε τον τίτλο της εργασίας.");
      return;
    }

    let deadline: string | null = null;

    if (dueAt) {
      const date = new Date(dueAt);

      if (
        Number.isNaN(date.getTime()) ||
        date.getTime() <= Date.now()
      ) {
        setError("Η προθεσμία πρέπει να είναι μελλοντική.");
        return;
      }

      deadline = date.toISOString();
    }

    setSubmitting(true);

    try {
      await createAssignment(courseId, {
        title: title.trim(),
        instructions: instructions.trim() || null,
        dueAt: deadline,
      });

      setTitle("");
      setInstructions("");
      setDueAt("");
      setSuccess("Η εργασία δημιουργήθηκε.");

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
    "mt-2 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={`${formId}-title`}
          className="block text-sm font-medium text-slate-700"
        >
          Τίτλος εργασίας
        </label>

        <input
          id={`${formId}-title`}
          type="text"
          required
          maxLength={200}
          placeholder="π.χ. Ασκήσεις εξισώσεων"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-instructions`}
          className="block text-sm font-medium text-slate-700"
        >
          Οδηγίες
          <span className="ml-1 font-normal text-slate-500">
            (προαιρετικές)
          </span>
        </label>

        <textarea
          id={`${formId}-instructions`}
          rows={4}
          maxLength={10000}
          placeholder="Τι χρειάζεται να ολοκληρώσει ο μαθητής;"
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-dueAt`}
          className="block text-sm font-medium text-slate-700"
        >
          Προθεσμία
          <span className="ml-1 font-normal text-slate-500">
            (προαιρετική)
          </span>
        </label>

        <input
          id={`${formId}-dueAt`}
          type="datetime-local"
          aria-describedby={`${formId}-deadline-help`}
          value={dueAt}
          onChange={(event) => setDueAt(event.target.value)}
          className={inputClassName}
        />

        <p
          id={`${formId}-deadline-help`}
          className="mt-2 text-xs leading-5 text-slate-500"
        >
          Η ώρα ακολουθεί τη ζώνη ώρας της συσκευής σου.
          Άφησέ το κενό για εργασία χωρίς προθεσμία.
        </p>
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
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Αποθήκευση…" : "Δημιουργία εργασίας"}
      </button>
    </form>
  );
}