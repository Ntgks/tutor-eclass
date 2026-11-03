"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import { updateCourse } from "@/lib/courses";
import type { Course } from "@/types/course";

interface EditCourseFormProps {
  course: Course;
  onUpdated: (course: Course) => void;
  onCancel: () => void;
}

export default function EditCourseForm({
  course,
  onUpdated,
  onCancel,
}: EditCourseFormProps) {
  const formId = useId();

  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(
    course.description ?? ""
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
      setError("Συμπλήρωσε τον τίτλο του μαθήματος.");
      return;
    }

    setSubmitting(true);

    try {
      const updatedCourse = await updateCourse(course.id, {
        title: title.trim(),
        description: description.trim() || null,
      });

      setSuccess("Το μάθημα ενημερώθηκε.");
      onUpdated(updatedCourse);
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
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <p className="text-sm font-semibold text-brand-900">
        Επεξεργασία μαθήματος
      </p>

      <div>
        <label
          htmlFor={`${formId}-title`}
          className="block text-sm font-medium text-slate-700"
        >
          Τίτλος μαθήματος
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
          htmlFor={`${formId}-description`}
          className="block text-sm font-medium text-slate-700"
        >
          Περιγραφή
          <span className="ml-1 font-normal text-slate-500">
            (προαιρετική)
          </span>
        </label>

        <textarea
          id={`${formId}-description`}
          rows={4}
          maxLength={5000}
          disabled={submitting}
          placeholder="Μια σύντομη περιγραφή του μαθήματος."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={`${inputClassName} leading-7`}
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