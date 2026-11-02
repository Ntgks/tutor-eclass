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

interface EditAssignmentFormProps  {
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();

    if(submitting) return;

    setError(null);
    setSuccess(null);

    if(!title.trim()){
        setError("Συμπλήρωσε τον τίτλο της εργασίας.");
        return;
    }

    let deadline = assignment.dueAt;

    if (dueAt !== toLocalDateTime(assignment.dueAt)) {
      deadline = null;

      if(dueAt){
        const date = new Date(dueAt);

        if(
          Number.isNaN(date.getTime()) ||
          date.getTime() <= Date.now()
        ){
          setError("Η νέα προθεσμία πρέπει να είναι μελλοντική.");
          return ;
        }

        deadline = date.toISOString();
      }
    }

    setSubmitting(true);

    try{
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

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={`${formId}-title`}
          className="block text-sm font-medium"
        >
          Τίτλος εργασίας
        </label>

        <input
          id={`${formId}-title`}
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2"
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-instructions`}
          className="block text-sm font-medium"
        >
          Οδηγίες — προαιρετικές
        </label>

        <textarea
          id={`${formId}-instructions`}
          rows={4}
          maxLength={10000}
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2"
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-dueAt`}
          className="block text-sm font-medium"
        >
          Προθεσμία — προαιρετική
        </label>

        <input
          id={`${formId}-dueAt`}
          type="datetime-local"
          value={dueAt}
          onChange={(event) => setDueAt(event.target.value)}
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

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? "Αποθήκευση…" : "Αποθήκευση αλλαγών"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-100 disabled:opacity-60"
        >
          Ακύρωση
        </button>
      </div>
    </form>
  );
}