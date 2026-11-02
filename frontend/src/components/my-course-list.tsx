"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getMyCourses } from "@/lib/courses";
import type { Course } from "@/types/course";

export default function MyCourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      try {
        const data = await getMyCourses();

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
  }, []);

  if (loading) {
    return (
      <p role="status" className="text-sm text-slate-500">
        Φόρτωση μαθημάτων…
      </p>
    );
  }

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
      >
        {error}
      </p>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-6">
        <p className="font-semibold text-brand-900">
          Δεν σου έχουν ανατεθεί ακόμη μαθήματα.
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Μόλις προστεθεί ένα μάθημα από την καθηγήτριά σου,
          θα εμφανιστεί εδώ.
        </p>
      </div>
    );
  }

  const visibleCourses = courses.filter(
    (course) => course.archived === showArchived
  );

  return (
    <div className="space-y-5">
      <div className="inline-flex max-w-full flex-wrap gap-1 rounded-lg bg-brand-900/5 p-1">
        <button
          type="button"
          onClick={() => setShowArchived(false)}
          aria-pressed={!showArchived}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
            !showArchived
              ? "bg-white text-brand-900 shadow-sm"
              : "text-slate-500 hover:text-brand-900"
          }`}
        >
          Ενεργά
        </button>

        <button
          type="button"
          onClick={() => setShowArchived(true)}
          aria-pressed={showArchived}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
            showArchived
              ? "bg-white text-brand-900 shadow-sm"
              : "text-slate-500 hover:text-brand-900"
          }`}
        >
          Αρχειοθετημένα
        </button>
      </div>

      {visibleCourses.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brand-200 bg-white p-5 text-sm leading-6 text-slate-500">
          {showArchived
            ? "Δεν υπάρχουν αρχειοθετημένα μαθήματα."
            : "Δεν υπάρχουν ενεργά μαθήματα."}
        </p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {visibleCourses.map((course) => (
            <li key={course.id} className="min-w-0">
              <Link
                href={`/courses/${course.id}`}
                className="group flex h-full flex-col rounded-2xl border border-brand-900/10 bg-white shadow-sm transition-colors hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <div className="flex items-center justify-between gap-3 rounded-t-2xl border-b border-brand-900/10 bg-brand-50/70 px-5 py-4">
                  <span className="text-xs font-semibold tracking-widest text-brand-700">
                    ΜΑΘΗΜΑ
                  </span>

                  {course.archived && (
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                      Αρχειοθετημένο
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="break-words text-lg font-semibold text-brand-900">
                    {course.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 break-words text-sm leading-7 text-slate-500">
                    {course.description || "Δεν έχει προστεθεί περιγραφή."}
                  </p>

                  <div className="mt-auto pt-6">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 group-hover:text-brand-900">
                      Άνοιγμα μαθήματος
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}