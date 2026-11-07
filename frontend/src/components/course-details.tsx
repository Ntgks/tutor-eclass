"use client";

import { useEffect, useId, useState } from "react";
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

type CourseSection = "materials" | "assignments";

export default function CourseDetails({
  courseId,
}: CourseDetailsProps) {
  const sectionId = useId();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canUpload, setCanUpload] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeSection, setActiveSection] =
    useState<CourseSection>("materials");

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

          setActiveSection(
            window.location.hash.startsWith("#assignment-")
              ? "assignments"
              : "materials"
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

    void loadCourse();

    return () => {
      active = false;
    };
  }, [courseId]);

  useEffect(() => {
    let frame: number | undefined;

    function handleHashChange() {
      const target = window.location.hash.slice(1);

      if (!target.startsWith("assignment-")) return;

      setActiveSection("assignments");

      frame = window.requestAnimationFrame(() => {
        document.getElementById(target)?.scrollIntoView({
          block: "start",
        });
      });
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);

      if (frame !== undefined) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  if (loading) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500"
      >
        Φόρτωση μαθήματος…
      </div>
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
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
        Το μάθημα δεν βρέθηκε.
      </p>
    );
  }

  const sectionButtonClassName =
    "inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={canUpload ? "/" : "/student"}
          className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <span aria-hidden="true">←</span>

          {canUpload
            ? "Επιστροφή στους μαθητές"
            : "Επιστροφή στα μαθήματά μου"}
        </Link>

        <div className="rounded-lg bg-white">
          <LogoutButton />
        </div>
      </div>

      <section
        aria-labelledby="course-title"
        className="overflow-hidden rounded-3xl border border-brand-900/10 bg-white"
      >
        <div className="relative overflow-hidden bg-brand-900 px-6 py-8 text-white sm:px-8 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[36px] border-white/5"
          />

          <div className="relative">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold tracking-widest text-brand-200">
                Ο ΧΩΡΟΣ ΤΟΥ ΜΑΘΗΜΑΤΟΣ
              </p>

              {course.archived && (
                <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-white">
                  Αρχειοθετημένο
                </span>
              )}
            </div>

            <h1
              id="course-title"
              className="max-w-4xl break-words text-2xl font-semibold tracking-tight sm:text-4xl"
            >
              {course.title}
            </h1>

            <p className="mt-4 max-w-3xl whitespace-pre-wrap break-words text-sm leading-7 text-brand-100">
              {course.description ||
                "Το υλικό και οι εργασίες του μαθήματος συγκεντρωμένα εδώ."}
            </p>
          </div>
        </div>

        {canUpload && (
          <div className="px-6 py-5 sm:px-8">
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
              <div className="mt-5 max-w-2xl rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
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

      <div
        role="group"
        aria-label="Περιεχόμενο μαθήματος"
        className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2"
      >
        <button
          id={`${sectionId}-materials-button`}
          type="button"
          aria-pressed={activeSection === "materials"}
          aria-controls={`${sectionId}-materials`}
          onClick={() => setActiveSection("materials")}
          className={`${sectionButtonClassName} ${
            activeSection === "materials"
              ? "bg-brand-50 text-brand-900"
              : "text-slate-500 hover:bg-slate-50 hover:text-brand-900"
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-5 w-5"
          >
            <path
              d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"
              strokeLinejoin="round"
            />
            <path
              d="M14 3v6h6M8 13h8M8 17h5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          Υλικό μαθήματος
        </button>

        <button
          id={`${sectionId}-assignments-button`}
          type="button"
          aria-pressed={activeSection === "assignments"}
          aria-controls={`${sectionId}-assignments`}
          onClick={() => setActiveSection("assignments")}
          className={`${sectionButtonClassName} ${
            activeSection === "assignments"
              ? "bg-brand-50 text-brand-900"
              : "text-slate-500 hover:bg-slate-50 hover:text-brand-900"
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-5 w-5"
          >
            <rect x="4" y="4" width="16" height="17" rx="2" />
            <path
              d="M9 3h6v4H9zM8 12h8M8 16h5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          Εργασίες
        </button>
      </div>

      <section
        id={`${sectionId}-materials`}
        hidden={activeSection !== "materials"}
        aria-labelledby={`${sectionId}-materials-title`}
        className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8"
      >
        <div className="mb-6 border-b border-slate-100 pb-5">
          <h2
            id={`${sectionId}-materials-title`}
            className="text-xl font-semibold tracking-tight text-brand-900"
          >
            Όλα όσα χρειάζεσαι για τη μελέτη
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Σημειώσεις και αρχεία του μαθήματος, έτοιμα για λήψη.
          </p>
        </div>

        <CourseMaterials
          courseId={course.id}
          canUpload={canUpload}
        />
      </section>

      <section
        id={`${sectionId}-assignments`}
        hidden={activeSection !== "assignments"}
        aria-labelledby={`${sectionId}-assignments-title`}
        className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8"
      >
        <div className="mb-6 border-b border-slate-100 pb-5">
          <h2
            id={`${sectionId}-assignments-title`}
            className="text-xl font-semibold tracking-tight text-brand-900"
          >
            Εργασίες και ανατροφοδότηση
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {canUpload
              ? "Δημιούργησε εργασίες και δες τις λύσεις των μαθητών σου."
              : "Δες τις οδηγίες, υπέβαλε τις λύσεις σου και διάβασε τις διορθώσεις."}
          </p>
        </div>

        <CourseAssignments
          courseId={course.id}
          canCreate={canUpload}
        />
      </section>
    </article>
  );
}