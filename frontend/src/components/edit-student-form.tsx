"use client";

import { useId, useState } from "react";
import type { Student } from "@/types/student";

import type { FormEvent } from "react";
import { updateStudent } from "@/lib/students";

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();

    if(submitting) return;

    setError(null);

    if(!fullName.trim()){
        setError("Συμπλήρωσε το ονοματεπώνυμο.");
        return;
    }

    setSubmitting(true);

    try{
        const updatedStudent = await updateStudent(student.id, {
            fullName: fullName.trim(),
            email: email.trim(),
            educationLevel: educationLevel.trim() || null,
        });

        onUpdated(updatedStudent);
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
          htmlFor={`${formId}-name`}
          className="block text-sm font-medium"
        >
          Ονοματεπώνυμο
        </label>

        <input
          id={`${formId}-name`}
          type="text"
          required
          maxLength={200}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2"
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-email`}
          className="block text-sm font-medium"
        >
          Email
        </label>

        <input
          id={`${formId}-email`}
          type="email"
          required
          maxLength={320}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2"
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-level`}
          className="block text-sm font-medium"
        >
          Τάξη / επίπεδο σπουδών — προαιρετικό
        </label>

        <input
          id={`${formId}-level`}
          type="text"
          maxLength={100}
          value={educationLevel}
          onChange={(event) => setEducationLevel(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
            {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
            {submitting ? "Αποθήκευση…" : "Αποθήκευση"}
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