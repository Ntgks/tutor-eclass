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
  INVITED: "Αναμονή ενεργοποίησης",
  ACTIVE: "Ενεργός",
  DISABLED: "Απενεργοποιημένος",
};

const statusStyles = {
  INVITED: "bg-amber-50 text-amber-800 ring-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  DISABLED: "bg-slate-100 text-slate-600 ring-slate-200",
};

function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/);

  if (words.length === 1) {
    return Array.from(words[0]).slice(0, 2).join("").toLocaleUpperCase("el-GR");
  }

  return [words[0], words[words.length - 1]]
    .map((word) => Array.from(word)[0])
    .join("")
    .toLocaleUpperCase("el-GR");
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStudentId, setEditingStudentId] =
    useState<string | null>(null);

  function handleStudentUpdated(updatedStudent: Student) {
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
    return (
      <p role="status" className="text-sm text-slate-500">
        Φόρτωση μαθητών…
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

  if (students.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-brand-200 bg-white p-6 text-sm text-slate-500">
        Δεν υπάρχουν ακόμη μαθητές. Πρόσθεσε τον πρώτο μαθητή από τη φόρμα.
      </p>
    );
  }

  return (
    <ul className="space-y-5">
      {students.map((student) => (
        <li
          key={student.id}
          className="rounded-2xl border border-brand-900/10 bg-white shadow-sm"
        >
          <div className="rounded-t-2xl border-b border-brand-900/10 bg-brand-50/70 px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 max-w-full items-start gap-3">
                <div
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-sm font-bold text-brand-900 ring-1 ring-inset ring-brand-200"
                >
                  {getInitials(student.fullName)}
                </div>

                <div className="min-w-0">
                  <h3 className="break-words text-base font-semibold text-brand-900">
                    {student.fullName}
                  </h3>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {student.email}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                  statusStyles[student.status]
                }`}
              >
                {statusLabels[student.status]}
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              {student.educationLevel || "Δεν έχει οριστεί επίπεδο σπουδών"}
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start gap-2">
              {editingStudentId !== student.id && (
                <button
                  type="button"
                  onClick={() => setEditingStudentId(student.id)}
                  className="rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
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
              <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50/50 p-4">
                <EditStudentForm
                  student={student}
                  onUpdated={handleStudentUpdated}
                  onCancel={() => setEditingStudentId(null)}
                />
              </div>
            )}

            <section
              className="mt-5 border-t border-slate-100 pt-5"
              aria-labelledby={`courses-title-${student.id}`}
            >
              <h4
                id={`courses-title-${student.id}`}
                className="mb-3 text-sm font-semibold text-brand-900"
              >
                Μαθήματα
              </h4>

              <StudentCourses studentId={student.id} />
            </section>
          </div>
        </li>
      ))}
    </ul>
  );
}