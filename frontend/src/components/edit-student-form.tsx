"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import { updateStudent } from "@/lib/students";
import type { Student } from "@/types/student";

interface EditStudentFormProps {
  student: Student;
  onUpdated: (student: Student) => void;
  onCancel: () => void;
}

export default function EditStudentForm({
  student,
  onUpdated,
  onCancel,
}: EditStudentFormProps) {
  const formId = useId();

  const [fullName, setFullName] = useState(student.fullName);
  const [email, setEmail] = useState(student.email);
  const [educationLevel, setEducationLevel] = useState(
    student.educationLevel ?? ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setError(null);

    if (!fullName.trim()) {
      setError("Συμπλήρωσε το ονοματεπώνυμο.");
      return;
    }

    setSubmitting(true);

    try {
      const updatedStudent = await updateStudent(student.id, {
        fullName: fullName.trim(),
        email: email.trim(),
        educationLevel: educationLevel.trim() || null,
      });

      onUpdated(updatedStudent);
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
        Επεξεργασία στοιχείων μαθητή
      </p>

      <div>
        <label
          htmlFor={`${formId}-name`}
          className="block text-sm font-medium text-slate-700"
        >
          Ονοματεπώνυμο
        </label>

        <input
          id={`${formId}-name`}
          type="text"
          required
          maxLength={200}
          disabled={submitting}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-email`}
          className="block text-sm font-medium text-slate-700"
        >
          Email
        </label>

        <input
          id={`${formId}-email`}
          type="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          maxLength={320}
          disabled={submitting}
          aria-describedby={`${formId}-email-help`}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClassName}
        />

        <p
          id={`${formId}-email-help`}
          className="mt-2 text-xs leading-5 text-slate-500"
        >
          Αν αλλάξεις το email, ο μαθητής θα χρησιμοποιεί το νέο
          στην επόμενη σύνδεσή του.
        </p>
      </div>

      <div>
        <label
          htmlFor={`${formId}-level`}
          className="block text-sm font-medium text-slate-700"
        >
          Τάξη / επίπεδο σπουδών
          <span className="ml-1 font-normal text-slate-500">
            (προαιρετικό)
          </span>
        </label>

        <input
          id={`${formId}-level`}
          type="text"
          maxLength={100}
          disabled={submitting}
          placeholder="π.χ. Β΄ Γυμνασίου"
          value={educationLevel}
          onChange={(event) => setEducationLevel(event.target.value)}
          className={inputClassName}
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