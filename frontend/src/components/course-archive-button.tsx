"use client";

import { useState } from "react";

import { archiveCourse, restoreCourse } from "@/lib/courses";
import type { Course } from "@/types/course";

interface CourseArchiveButtonProps {
  course: Course;
  onChanged: (course: Course) => void;
}

export default function CourseArchiveButton({
  course,
  onChanged,
}: CourseArchiveButtonProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (submitting) return;

    if (
      !course.archived &&
      !window.confirm(
        "Να αρχειοθετηθεί το μάθημα; Τα δεδομένα του θα διατηρηθούν."
      )
    ) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const updatedCourse = course.archived
        ? await restoreCourse(course.id)
        : await archiveCourse(course.id);

      onChanged(updatedCourse);
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
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={submitting}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-60"
      >
        {submitting
          ? "Αποθήκευση…"
          : course.archived
            ? "Επαναφορά μαθήματος"
            : "Αρχειοθέτηση μαθήματος"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}