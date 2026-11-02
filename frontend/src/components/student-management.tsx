"use client";

import { useState } from "react";

import CreateStudentForm from "@/components/create-student-form";
import StudentList from "@/components/student-list";

export default function StudentManagement() {
  const [listVersion, setListVersion] = useState(0);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <section
        className="rounded-xl border border-slate-200 bg-white p-5"
        aria-labelledby="create-student-title"
      >
        <h2
          id="create-student-title"
          className="text-lg font-semibold tracking-tight"
        >
          Νέος μαθητής
        </h2>

        <p className="mb-5 mt-1 text-sm leading-6 text-slate-500">
          Πρόσθεσε τα στοιχεία του μαθητή για να οργανώσεις τα μαθήματά του.
        </p>

        <CreateStudentForm
          onCreated={() => setListVersion((version) => version + 1)}
        />
      </section>

      <section
        className="min-w-0"
        aria-labelledby="student-list-title"
      >
        <h2
          id="student-list-title"
          className="mb-4 text-lg font-semibold tracking-tight"
        >
          Οι μαθητές σου
        </h2>

        <StudentList key={listVersion} />
      </section>
    </div>
  );
}