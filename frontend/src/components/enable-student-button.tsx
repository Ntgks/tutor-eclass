"use client";

import { useState } from "react";

import { enableStudent } from "@/lib/students";
import type { Student } from "@/types/student";

interface EnableStudentButtonProps {
  studentId: string;
  onEnabled: (student: Student) => void;
}

export default function EnableStudentButton({
  studentId,
  onEnabled,
}: EnableStudentButtonProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEnable() {
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      const student = await enableStudent(studentId);
      onEnabled(student);
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
    <div className="min-w-0">
      <button
        type="button"
        onClick={handleEnable}
        disabled={submitting}
        className="rounded-lg border border-green-300 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 disabled:opacity-60"
      >
        {submitting ? "Επανενεργοποίηση…" : "Επανενεργοποίηση μαθητή"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}