"use client";

import { useEffect, useState } from "react";

import { getStudentCourses } from "@/lib/courses";
import type { Course } from "@/types/course";

import Link from "next/link";

interface CourseListProps {
  studentId: string;
}

export default function CourseList({ studentId }: CourseListProps){
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading,setLoading] = useState(true);
    const[error,setError] = useState<string | null>(null);
    const [showArchived, setShowArchived] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadCourses(){
            try{
                const data = await getStudentCourses(studentId);

                if(active) {
                    setCourses(data);
                }
            }catch(error){
                if(active){
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

    if(loading){
        return <p role="status">Φόρτωση μαθημάτων…</p>;
    }

    if (error) {
        return <p role="alert">{error}</p>;
    }

    if(courses.length === 0){
        return <p>Δεν υπάρχουν ακόμη μαθήματα για αυτόν τον μαθητή.</p>;
    }

    const visibleCourses = courses.filter(
        (course) => course.archived === showArchived
    );

    return(
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => setShowArchived(false)}
                aria-pressed={!showArchived}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                !showArchived
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-300 hover:bg-slate-100"
                }`}
            >
                Ενεργά
            </button>

            <button
                type="button"
                onClick={() => setShowArchived(true)}
                aria-pressed={showArchived}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                showArchived
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-300 hover:bg-slate-100"
                }`}
            >
                Αρχειοθετημένα
            </button>
            </div>

            {visibleCourses.length === 0 ? (
            <p>
                {showArchived
                ? "Δεν υπάρχουν αρχειοθετημένα μαθήματα."
                : "Δεν υπάρχουν ενεργά μαθήματα."}
            </p>
            ) : (
            <ul className="space-y-3">
                {visibleCourses.map((course) => (
                <li
                    key={course.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                    <h3 className="font-semibold">
                    <Link
                        href={`/courses/${course.id}`}
                        className="text-indigo-700 hover:underline"
                    >
                        {course.title}
                    </Link>
                    </h3>

                    {course.description && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                        {course.description}
                    </p>
                    )}
                </li>
                ))}
            </ul>
            )}
        </div>
    );
}