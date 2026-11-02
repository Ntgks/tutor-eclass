"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getStudentCourses } from "@/lib/courses";
import type { Course } from "@/types/course";

interface CourseListProps {
  studentId: string;
}

export default function CourseList({ studentId }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      try {
        const data = await getStudentCourses(studentId);

        if (active) {
          setCourses(data);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Παρουσιάστηκε σφάλμα."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      active = false;
    };
  }, [studentId]);

  if (loading) {
    return (
      <p role="status" className="text-sm text-slate-500">
        Φόρτωση μαθημάτων…
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (courses.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
        Δεν υπάρχουν ακόμη μαθήματα για αυτόν τον μαθητή.
      </p>
    );
  }

  const visibleCourses = courses.filter(
    (course) => course.archived === showArchived
  );

  return (
    <div className="space-y-4">
      <div className="inline-flex max-w-full flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setShowArchived(false)}
          aria-pressed={!showArchived}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            !showArchived
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Ενεργά
        </button>

        <button
          type="button"
          onClick={() => setShowArchived(true)}
          aria-pressed={showArchived}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            showArchived
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Αρχειοθετημένα
        </button>
      </div>

      {visibleCourses.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
          {showArchived
            ? "Δεν υπάρχουν αρχειοθετημένα μαθήματα."
            : "Δεν υπάρχουν ενεργά μαθήματα."}
        </p>
      ) : (
        <ul className="space-y-2">
          {visibleCourses.map((course) => (
            <li key={course.id}>
              <Link
                href={`/courses/${course.id}`}
                className="group block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="min-w-0 break-words text-sm font-semibold text-slate-800 group-hover:text-indigo-700">
                    {course.title}
                  </h4>

                  <span
                    aria-hidden="true"
                    className="shrink-0 text-slate-400 group-hover:text-indigo-600"
                  >
                    →
                  </span>
                </div>

                {course.description && (
                  <p className="mt-1 line-clamp-2 break-words text-sm leading-6 text-slate-500">
                    {course.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}