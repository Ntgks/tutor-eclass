"use client";

import { useState } from "react";

import { disableStudent } from "@/lib/students";
import type { Student } from "@/types/student";

interface DisableStudentButtonProps {
  studentId: string;
  onDisabled: (student: Student) => void;
}

export default function DisableStudentButton({
  studentId,
  onDisabled,
}: DisableStudentButtonProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDisable() {
    if (submitting) return;

    if (!window.confirm(
      "Να απενεργοποιηθεί ο μαθητής; Θα χάσει την πρόσβαση, αλλά τα δεδομένα του θα διατηρηθούν."
    )) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const student = await disableStudent(studentId);
      onDisabled(student);
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
        onClick={handleDisable}
        disabled={submitting}
        className="rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
      >
        {submitting ? "Απενεργοποίηση…" : "Απενεργοποίηση μαθητή"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}