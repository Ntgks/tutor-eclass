"use client";

import { useEffect, useState } from "react";

import { getCourse } from "@/lib/courses";
import type { Course } from "@/types/course";

import CourseMaterials from "@/components/course-materials";
import { getCurrentUser } from "@/lib/auth";

import CourseAssignments from "@/components/course-assignments";

import Link from "next/link";
import LogoutButton from "@/components/logout-button";

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

  useEffect(() => {
    let active = true;

    async function loadCourse() {
      try {
        const [data, user] = await Promise.all([
            getCourse(courseId),
            getCurrentUser(),
        ]);

        if(active){
            setCourse(data);
            setCanUpload(user?.authorities.includes("ROLE_TEACHER") ?? false);
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
    return <p role="status">Φόρτωση μαθήματος…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!course) {
    return <p>Το μάθημα δεν βρέθηκε.</p>;
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={canUpload ? "/" : "/student"}
          className="text-sm font-semibold text-indigo-700 hover:underline"
        >
          {canUpload
            ? "Επιστροφή στους μαθητές"
            : "Επιστροφή στα μαθήματά μου"}
        </Link>

        <LogoutButton />
      </div>
      <h1 className="text-2xl font-bold">{course.title}</h1>

      <p className="mt-3 whitespace-pre-wrap text-slate-600">
        {course.description || "Δεν έχει προστεθεί περιγραφή."}
      </p>

      <section className="mt-8" aria-labelledby="materials-title">
        <h2 id="materials-title" className="mb-4 text-xl font-semibold">
            Υλικό μαθήματος
        </h2>

        <CourseMaterials
            courseId={course.id}
            canUpload={canUpload}
        />
      </section>

      <section
        className="mt-8 border-t border-slate-200 pt-6"
        aria-labelledby="assignments-title"
      >
        <h2 id="assignments-title" className="mb-4 text-xl font-semibold">
          Εργασίες
        </h2>

        <CourseAssignments
          courseId={courseId}
          canCreate={canUpload}
        />
      </section>
    </article>
  );
}