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

    return(
        <ul className="space-y-3">
            {courses.map((course) => (
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
    );
}