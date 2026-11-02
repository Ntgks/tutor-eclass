"use client";

import { useId, useRef, useState } from "react";
import type { FormEvent } from "react";

import { uploadMaterial } from "@/lib/materials";

interface UploadMaterialFormProps {
  courseId: string;
  onUploaded?: () => void;
}

export default function UploadMaterialForm({
  courseId,
  onUploaded,
}: UploadMaterialFormProps) {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Συμπλήρωσε τον τίτλο του υλικού.");
      return;
    }

    if (!file || file.size === 0) {
      setError("Επίλεξε ένα αρχείο που δεν είναι κενό.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Το αρχείο υπερβαίνει το όριο των 10 MB.");
      return;
    }

    setSubmitting(true);

    try {
      await uploadMaterial(courseId, { title: title.trim() }, file);

      setTitle("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess("Το αρχείο ανέβηκε επιτυχώς.");
      onUploaded?.();
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
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={`${formId}-title`}
          className="block text-sm font-medium text-slate-700"
        >
          Τίτλος υλικού
        </label>

        <input
          id={`${formId}-title`}
          type="text"
          required
          maxLength={200}
          placeholder="π.χ. Σημειώσεις εξισώσεων"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-file`}
          className="block text-sm font-medium text-slate-700"
        >
          Αρχείο
        </label>

        <input
          id={`${formId}-file`}
          ref={fileInputRef}
          type="file"
          required
          aria-describedby={`${formId}-file-help`}
          onChange={(event) =>
            setFile(event.target.files?.[0] ?? null)
          }
          className="mt-2 block w-full min-w-0 rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-600 file:mr-2 file:cursor-pointer file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand-700 hover:file:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        />

        <p
          id={`${formId}-file-help`}
          className="mt-2 text-xs leading-5 text-slate-500"
        >
          Μέγιστο μέγεθος αρχείου: 10 MB.
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
        {submitting ? "Ανέβασμα…" : "Ανέβασμα αρχείου"}
      </button>
    </form>
  );
}