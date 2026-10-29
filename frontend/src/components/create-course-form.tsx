"use client";

import { useId, useState } from "react";

import type { FormEvent } from "react";
import { createCourse } from "@/lib/courses";

interface CreateCourseFormProps {
  studentId: string;
  onCreated?: () => void;
}

export default function CreateCourseForm({
  studentId,
  onCreated,
}: CreateCourseFormProps) {
  const formId = useId();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if(submitting) return;

    setError(null);
    setSuccess(null);

    if(!title.trim()){
        setError("Συμπλήρωσε τον τίτλο του μαθήματος.");
        return;
    }

    setSubmitting(true);

    try{
        await createCourse(studentId, {
            title: title.trim(),
            description: description.trim() || null,
        });

        setTitle("");
        setDescription("");
        setSuccess("Το μάθημα δημιουργήθηκε.");

        onCreated?.();
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
 

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={`${formId}-title`}
          className="block text-sm font-medium"
        >
          Τίτλος μαθήματος
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
          htmlFor={`${formId}-description`}
          className="block text-sm font-medium"
        >
          Περιγραφή — προαιρετική
        </label>

        <textarea
          id={`${formId}-description`}
          rows={3}
          maxLength={5000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
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
        {submitting ? "Αποθήκευση…" : "Δημιουργία μαθήματος"}
      </button>
    </form>
  );
}