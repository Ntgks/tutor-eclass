"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import { updateAssignment } from "@/lib/assignments";
import type { Assignment } from "@/types/assignment";

function toLocalDateTime(value: string | null): string {
  if (!value) return "";

  const date = new Date(value);
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000
  );

  return localDate.toISOString().slice(0, 16);
}

interface EditAssignmentFormProps {
  courseId: string;
  assignment: Assignment;
  onUpdated: (assignment: Assignment) => void;
  onCancel: () => void;
}

export default function EditAssignmentForm({
  courseId,
  assignment,
  onUpdated,
  onCancel,
}: EditAssignmentFormProps) {
  const formId = useId();

  const [title, setTitle] = useState(assignment.title);
  const [instructions, setInstructions] = useState(
    assignment.instructions ?? ""
  );
  const [dueAt, setDueAt] = useState(
    toLocalDateTime(assignment.dueAt)
  );
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

    let deadline = assignment.dueAt;

    if (dueAt !== toLocalDateTime(assignment.dueAt)) {
      deadline = null;

      if (dueAt) {
        const date = new Date(dueAt);

        if (
          Number.isNaN(date.getTime()) ||
          date.getTime() <= Date.now()
        ) {
          setError("Η νέα προθεσμία πρέπει να είναι μελλοντική.");
          return;
        }

        deadline = date.toISOString();
      }
    }

    setSubmitting(true);

    try {
      const updatedAssignment = await updateAssignment(
        courseId,
        assignment.id,
        {
          title: title.trim(),
          instructions: instructions.trim() || null,
          dueAt: deadline,
        }
      );

      setSuccess("Η εργασία ενημερώθηκε.");
      onUpdated(updatedAssignment);
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
    "mt-2 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <p className="text-sm font-semibold text-brand-900">
        Επεξεργασία εργασίας
      </p>

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
          disabled={submitting}
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
          disabled={submitting}
          placeholder="Τι χρειάζεται να ολοκληρώσει ο μαθητής;"
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          className={`${inputClassName} leading-7`}
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
          disabled={submitting}
          aria-describedby={`${formId}-deadline-help`}
          value={dueAt}
          onChange={(event) => setDueAt(event.target.value)}
          className={inputClassName}
        />

        <p
          id={`${formId}-deadline-help`}
          className="mt-2 text-xs leading-6 text-slate-500"
        >
          Η ώρα ακολουθεί τη ζώνη ώρας της συσκευής σου.
          Αν αλλάξεις την ημερομηνία, η νέα πρέπει να είναι
          μελλοντική. Άφησε το πεδίο κενό για να αφαιρέσεις
          την προθεσμία.
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

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-60"
        >
          Ακύρωση
        </button>
      </div>
    </form>
  );
}