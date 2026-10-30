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

  async function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();

    if(submitting) return;

    setError(null);
    setSuccess(null);

    if(!title.trim()){
        setError("Συμπλήρωσε τον τίτλο της εργασίας.");
        return;
    }

    let deadline : string | null = null;

    if(dueAt){
        const date = new Date(dueAt);

        if(
            Number.isNaN(date.getTime()) ||
            date.getTime() <= Date.now()
        ){
            setError("Η προθεσμία πρέπει να είναι μελλοντική.");
            return;
        }

        deadline = date.toISOString();
    }

    setSubmitting(true);

    try{
        await createAssignment(courseId, {
            title: title.trim(),
            instructions: instructions.trim() || null,
            dueAt: deadline
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

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Αποθήκευση…" : "Δημιουργία εργασίας"}
      </button>
    </form>
  );
}