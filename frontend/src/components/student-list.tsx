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
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <h2 className="font-semibold">{student.fullName}</h2>
          <p className="text-sm text-slate-600">{student.email}</p>

          <p className="mt-2 text-sm text-slate-600">
            {student.educationLevel || "Δεν έχει οριστεί επίπεδο σπουδών"}
          </p>

          <p className="mt-1 text-sm font-medium text-indigo-700">
            {statusLabels[student.status]}
          </p>

          <div className="mt-4">
            {editingStudentId === student.id ? (
              <EditStudentForm
                student={student}
                onUpdated={handleStudentUpdated}
                onCancel={() => setEditingStudentId(null)}
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingStudentId(student.id)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100"
              >
                Επεξεργασία στοιχείων
              </button>
            )}
          </div>

          {student.status === "INVITED" && (
            <InvitationButton studentId={student.id} />
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