"use client";

import { useEffect, useState } from "react";

import { getMyCourses } from "@/lib/courses";
import type { Course } from "@/types/course";

import Link from "next/link";

export default function MyCourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return <p role="status">Φόρτωση μαθημάτων…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (courses.length === 0) {
    return <p>Δεν σου έχουν ανατεθεί ακόμη μαθήματα.</p>;
  }

  return (
    <ul className="space-y-3">
      {courses.map((course) => (
        <li
          key={course.id}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <h2 className="font-semibold">
            <Link
              href={`/courses/${course.id}`}
              className="text-indigo-700 hover:underline"
            >
              {course.title}
            </Link>
          </h2>

          {course.description && (
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
              {course.description}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}