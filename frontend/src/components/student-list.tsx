"use client";

import { useEffect, useId, useState } from "react";

import { getStudents } from "@/lib/students";
import type { Student } from "@/types/student";

import InvitationButton from "@/components/invitation-button";
import StudentCourses from "@/components/student-courses";
import EditStudentForm from "@/components/edit-student-form";
import DisableStudentButton from "@/components/disable-student-button";
import EnableStudentButton from "@/components/enable-student-button";

type StatusFilter = "ALL" | Student["status"];

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

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("el-GR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ς/g, "σ");
}

function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "Μ";
  }

  if (words.length === 1) {
    return Array.from(words[0])
      .slice(0, 2)
      .join("")
      .toLocaleUpperCase("el-GR");
  }

  return [words[0], words[words.length - 1]]
    .map((word) => Array.from(word)[0])
    .join("")
    .toLocaleUpperCase("el-GR");
}

export default function StudentList() {
  const filterId = useId();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(
    null
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

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

  function clearFilters() {
    setSearch("");
    setStatusFilter("ALL");
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

    void loadStudents();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <p
        role="status"
        className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500"
      >
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
      <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-8">
        <p className="font-semibold text-brand-900">
          Ο πρώτος σου μαθητής ξεκινά εδώ.
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Πάτησε «Νέος μαθητής» για να προσθέσεις τα στοιχεία του και να
          οργανώσεις τα μαθήματά του.
        </p>
      </div>
    );
  }

  const query = normalizeSearch(search);

  const visibleStudents = students.filter((student) => {
    const matchesStatus =
      statusFilter === "ALL" || student.status === statusFilter;

    const matchesSearch =
      normalizeSearch(student.fullName).includes(query) ||
      normalizeSearch(student.email).includes(query);

    return matchesStatus && matchesSearch;
  });

  const hasFilters = search !== "" || statusFilter !== "ALL";

  const inputClassName =
    "mt-2 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid items-end gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
          <div>
            <label
              htmlFor={`${filterId}-search`}
              className="block text-xs font-semibold text-slate-600"
            >
              Αναζήτηση μαθητή
            </label>

            <div className="relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              >
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path
                  d="m16 16 4 4"
                  strokeLinecap="round"
                />
              </svg>

              <input
                id={`${filterId}-search`}
                type="search"
                placeholder="Αναζήτηση με όνομα ή email…"
                autoComplete="off"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={`${inputClassName} pl-10`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor={`${filterId}-status`}
              className="block text-xs font-semibold text-slate-600"
            >
              Κατάσταση λογαριασμού
            </label>

            <select
              id={`${filterId}-status`}
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className={inputClassName}
            >
              <option value="ALL">Όλοι οι μαθητές</option>
              <option value="ACTIVE">Ενεργοί</option>
              <option value="INVITED">Αναμονή ενεργοποίησης</option>
              <option value="DISABLED">Απενεργοποιημένοι</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p role="status" className="text-xs leading-6 text-slate-500">
            Εμφανίζονται {visibleStudents.length} από {students.length} μαθητές.
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-md px-2 py-1 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              Καθαρισμός φίλτρων
            </button>
          )}
        </div>
      </div>

      {visibleStudents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-8">
          <p className="text-sm font-semibold text-brand-900">
            Δεν βρέθηκαν μαθητές.
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Δοκίμασε άλλο όνομα, email ή κατάσταση.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-lg text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Εμφάνιση όλων των μαθητών
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {visibleStudents.map((student) => (
            <li key={student.id}>
              <details className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors open:border-brand-200">
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-4 p-5 transition-colors hover:bg-brand-50/50 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand-600 [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-sm font-bold text-brand-700 ring-1 ring-inset ring-brand-900/5"
                  >
                    {getInitials(student.fullName)}
                  </span>

                  <span className="min-w-0 flex-1 basis-40">
                    <span className="block break-words text-sm font-semibold text-brand-900">
                      {student.fullName}
                    </span>

                    <span className="mt-1 block break-all text-xs leading-5 text-slate-500">
                      {student.email}
                    </span>
                  </span>

                  <span className="hidden max-w-40 break-words text-xs text-slate-500 xl:block">
                    {student.educationLevel || "Δεν έχει οριστεί τάξη"}
                  </span>

                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                      statusStyles[student.status]
                    }`}
                  >
                    {statusLabels[student.status]}
                  </span>

                  <span className="ml-auto inline-flex items-center gap-2 text-xs font-semibold text-brand-700">
                    <span className="group-open:hidden">Άνοιγμα</span>
                    <span className="hidden group-open:inline">
                      Κλείσιμο
                    </span>

                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-4 w-4 transition-transform group-open:rotate-180"
                    >
                      <path
                        d="m5 7.5 5 5 5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </summary>

                <div className="border-t border-slate-100 p-5 sm:p-6">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">
                      {student.educationLevel ||
                        "Δεν έχει οριστεί επίπεδο σπουδών"}
                    </p>

                    <p className="text-xs font-medium text-brand-700">
                      Στοιχεία και μαθήματα μαθητή
                    </p>
                  </div>

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
                    className="mt-6 border-t border-slate-100 pt-5"
                    aria-labelledby={`courses-title-${student.id}`}
                  >
                    <h3
                      id={`courses-title-${student.id}`}
                      className="mb-4 text-sm font-semibold text-brand-900"
                    >
                      Μαθήματα του μαθητή
                    </h3>

                    <StudentCourses studentId={student.id} />
                  </section>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}