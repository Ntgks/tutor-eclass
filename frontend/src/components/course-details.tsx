"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getCourse } from "@/lib/courses";
import { getCurrentUser } from "@/lib/auth";
import type { Course } from "@/types/course";

import CourseMaterials from "@/components/course-materials";
import CourseAssignments from "@/components/course-assignments";
import LogoutButton from "@/components/logout-button";
import EditCourseForm from "@/components/edit-course-form";
import CourseArchiveButton from "@/components/course-archive-button";

interface CourseDetailsProps {
  courseId: string;
}

export default function CourseDetails({
  courseId,
}: CourseDetailsProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canUpload, setCanUpload] = useState(false);
  const [editing, setEditing] = useState(false);

  function handleCourseUpdated(updatedCourse: Course) {
    setCourse(updatedCourse);
    setEditing(false);
  }

  useEffect(() => {
    let active = true;

    async function loadCourse() {
      try {
        const [data, user] = await Promise.all([
          getCourse(courseId),
          getCurrentUser(),
        ]);

        if (active) {
          setCourse(data);
          setCanUpload(
            user?.authorities.includes("ROLE_TEACHER") ?? false
          );
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

    loadCourse();

    return () => {
      active = false;
    };
  }, [courseId]);

  if (loading) {
    return (
      <p role="status" className="text-sm text-slate-500">
        Φόρτωση μαθήματος…
      </p>
    );
  }

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        {error}
      </p>
    );
  }

  if (!course) {
    return <p className="text-slate-600">Το μάθημα δεν βρέθηκε.</p>;
  }

  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={canUpload ? "/" : "/student"}
          className="inline-flex items-center gap-2 rounded-md py-2 text-sm font-semibold text-brand-700 hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <span aria-hidden="true">←</span>

          {canUpload
            ? "Επιστροφή στους μαθητές"
            : "Επιστροφή στα μαθήματά μου"}
        </Link>

        <LogoutButton />
      </div>

      <section
        className="rounded-2xl border border-brand-900/10 bg-white shadow-sm"
        aria-labelledby="course-title"
      >
        <div className="rounded-t-2xl border-b border-brand-900/10 bg-brand-50/70 p-5 sm:p-7">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold tracking-widest text-brand-700">
              ΜΑΘΗΜΑ
            </p>

            {course.archived && (
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                Αρχειοθετημένο
              </span>
            )}
          </div>

          <h1
            id="course-title"
            className="break-words text-2xl font-semibold tracking-tight text-brand-900 sm:text-3xl"
          >
            {course.title}
          </h1>

          <p className="mt-3 max-w-3xl whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
            {course.description || "Δεν έχει προστεθεί περιγραφή."}
          </p>
        </div>

        {canUpload && (
          <div className="p-5 sm:px-7">
            <div className="flex flex-wrap items-start gap-3">
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-lg border border-brand-200 px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  Επεξεργασία μαθήματος
                </button>
              )}

              <CourseArchiveButton
                course={course}
                onChanged={handleCourseUpdated}
              />
            </div>

            {editing && (
              <div className="mt-4 max-w-2xl rounded-xl border border-brand-200 bg-brand-50/50 p-4">
                <EditCourseForm
                  key={course.id}
                  course={course}
                  onUpdated={handleCourseUpdated}
                  onCancel={() => setEditing(false)}
                />
              </div>
            )}
          </div>
        )}
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section
          className="min-w-0 rounded-2xl border border-brand-900/10 bg-white p-5 shadow-sm sm:p-6"
          aria-labelledby="materials-title"
        >
          <div className="mb-5 border-b border-slate-100 pb-4">
            <h2
              id="materials-title"
              className="text-lg font-semibold text-brand-900"
            >
              Υλικό μαθήματος
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Σημειώσεις και αρχεία για τη μελέτη σου.
            </p>
          </div>

          <CourseMaterials
            courseId={course.id}
            canUpload={canUpload}
          />
        </section>

        <section
          className="min-w-0 rounded-2xl border border-brand-900/10 bg-white p-5 shadow-sm sm:p-6"
          aria-labelledby="assignments-title"
        >
          <div className="mb-5 border-b border-slate-100 pb-4">
            <h2
              id="assignments-title"
              className="text-lg font-semibold text-brand-900"
            >
              Εργασίες
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Οδηγίες, προθεσμίες και διορθώσεις.
            </p>
          </div>

          <CourseAssignments
            courseId={course.id}
            canCreate={canUpload}
          />
        </section>
      </div>
    </article>
  );
}