"use client";

import { useEffect, useState } from "react";

import { getStudents } from "@/lib/students";
import type { Student } from "@/types/student";

import InvitationButton from "@/components/invitation-button";

import StudentCourses from "@/components/student-courses";

import EditStudentForm from "@/components/edit-student-form";

import DisableStudentButton from "@/components/disable-student-button";

import EnableStudentButton from "@/components/enable-student-button";

const statusLabels = {
    INVITED:"Αναμονή ενεργοποίησης",
    ACTIVE: "Ενεργός",
    DISABLED:"Απενεργοποιημένος",
};

const statusStyles = {
  INVITED: "bg-amber-50 text-amber-800 ring-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  DISABLED: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const[editingStudentId, setEditingStudentId] = 
    useState<string | null>(null);
  
  function handleStudentUpdated(updatedStudent: Student){
    setStudents((current) => 
      current.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );

    setEditingStudentId((current) =>
      current === updatedStudent.id ? null : current
    );
  }

  useEffect(() => {
    let active = true;

    async function loadStudents() {
      try {
        const data = await getStudents();

        if (active) {
          setStudents(data);
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

    loadStudents();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p role="status">Φόρτωση μαθητών…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (students.length === 0) {
    return <p>Δεν υπάρχουν ακόμη μαθητές.</p>;
  }

  return (
    <ul className="space-y-3">
      {students.map((student) => (
        <li
          key={student.id}
          className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="break-words text-base font-semibold text-slate-900">
                {student.fullName}
              </h3>

              <p className="mt-1 break-all text-sm text-slate-500">
                {student.email}
              </p>
            </div>

            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                statusStyles[student.status]
              }`}
            >
              {statusLabels[student.status]}
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {student.educationLevel || "Δεν έχει οριστεί επίπεδο σπουδών"}
          </p>

          <div className="mt-4 flex flex-wrap items-start gap-2">
            {editingStudentId !== student.id && (
              <button
                type="button"
                onClick={() => setEditingStudentId(student.id)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Επεξεργασία στοιχείων
              </button>
            )}

            {student.status === "INVITED" && (
              <div className="min-w-0 max-w-full">
                <InvitationButton studentId={student.id} />
              </div>
            )}

            {student.status === "DISABLED" ? (
              <EnableStudentButton
                studentId={student.id}
                onEnabled={handleStudentUpdated}
              />
            ) : (
              <DisableStudentButton
                studentId={student.id}
                onDisabled={handleStudentUpdated}
              />
            )}
          </div>

          {editingStudentId === student.id && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <EditStudentForm
                student={student}
                onUpdated={handleStudentUpdated}
                onCancel={() => setEditingStudentId(null)}
              />
            </div>
          )}

          <section
            className="mt-4 border-t border-slate-200 pt-4"
            aria-labelledby={`courses-title-${student.id}`}
          >
            <h3
              id={`courses-title-${student.id}`}
              className="mb-3 font-semibold"
            >
              Μαθήματα
            </h3>

            <StudentCourses studentId={student.id} />
          </section>
        </li>
      ))}
    </ul>
  );
}