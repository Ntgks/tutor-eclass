"use client";

import { useId, useRef, useState } from "react";

import CreateStudentForm from "@/components/create-student-form";
import StudentList from "@/components/student-list";

export default function StudentManagement() {
  const formId = useId();
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const [listVersion, setListVersion] = useState(0);
  const [showForm, setShowForm] = useState(false);

  function handleStudentCreated() {
    setListVersion((version) => version + 1);
    setShowForm(false);
    toggleButtonRef.current?.focus();
  }

  return (
    <section aria-labelledby="student-list-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            id="student-list-title"
            className="text-xl font-semibold tracking-tight text-brand-900"
          >
            Οι μαθητές σου
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Στοιχεία, μαθήματα και πρόσβαση μαθητών.
          </p>
        </div>

        <button
          ref={toggleButtonRef}
          type="button"
          onClick={() => setShowForm((current) => !current)}
          aria-expanded={showForm}
          aria-controls={formId}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            {showForm ? "−" : "+"}
          </span>

          {showForm ? "Κλείσιμο φόρμας" : "Νέος μαθητής"}
        </button>
      </div>

      <div id={formId} hidden={!showForm}>
        {showForm && (
          <section
            className="mb-6 max-w-2xl rounded-2xl border border-brand-200 bg-white p-5 shadow-sm sm:p-6"
            aria-labelledby={`${formId}-title`}
          >
            <div className="max-w-xl">
              <h3
                id={`${formId}-title`}
                className="text-lg font-semibold text-brand-900"
              >
                Προσθήκη μαθητή
              </h3>

              <p className="mb-5 mt-1 text-sm leading-6 text-slate-500">
                Συμπλήρωσε τα στοιχεία του μαθητή. Μετά τη δημιουργία
                μπορείς να εκδώσεις πρόσκληση ενεργοποίησης.
              </p>

              <CreateStudentForm onCreated={handleStudentCreated} />
            </div>
          </section>
        )}
      </div>

      <StudentList key={listVersion} />
    </section>
  );
}