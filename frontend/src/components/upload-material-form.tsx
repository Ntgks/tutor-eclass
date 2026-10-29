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

    if(submitting) return;

    setError(null);
    setSuccess(null);

    if(!title.trim()){
        setError("Συμπλήρωσε τον τίτλο του υλικού.");
        return;
    }

    if(!file || file.size === 0){
        setError("Επίλεξε ένα αρχείο που δεν είναι κενό.");
        return;
    }

    if(file.size > 10 * 1024 * 1024){
        setError("Το αρχείο υπερβαίνει το όριο των 10 MB.");
        return;
    }

    setSubmitting(true);

    try{
        await uploadMaterial(courseId, { title: title.trim() }, file);

        setTitle("");
        setFile(null);

        if(fileInputRef.current) {
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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={`${formId}-title`}
          className="block text-sm font-medium"
        >
          Τίτλος υλικού
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
          htmlFor={`${formId}-file`}
          className="block text-sm font-medium"
        >
          Αρχείο — έως 10 MB
        </label>

        <input
          id={`${formId}-file`}
          ref={fileInputRef}
          type="file"
          required
          onChange={(event) =>
            setFile(event.target.files?.[0] ?? null)
          }
          className="mt-1 block w-full text-sm"
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
        {submitting ? "Ανέβασμα…" : "Ανέβασμα αρχείου"}
      </button>
    </form>
  );
}