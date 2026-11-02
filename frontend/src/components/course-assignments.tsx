"use client";

import { useId, useRef, useState } from "react";

import AssignmentList from "@/components/assignment-list";
import CreateAssignmentForm from "@/components/create-assignment-form";

interface CourseAssignmentsProps {
  courseId: string;
  canCreate: boolean;
}

export default function CourseAssignments({
  courseId,
  canCreate,
}: CourseAssignmentsProps) {
  const formId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [listVersion, setListVersion] = useState(0);
  const [showForm, setShowForm] = useState(false);

  function handleCreated() {
    setListVersion((version) => version + 1);
    setShowForm(false);
    buttonRef.current?.focus();
  }

  return (
    <div className="space-y-4">
      {canCreate && (
        <>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setShowForm((current) => !current)}
            aria-expanded={showForm}
            aria-controls={formId}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <span aria-hidden="true">
              {showForm ? "−" : "+"}
            </span>

            {showForm ? "Κλείσιμο φόρμας" : "Νέα εργασία"}
          </button>

          <div id={formId} hidden={!showForm}>
            {showForm && (
              <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4">
                <CreateAssignmentForm
                  courseId={courseId}
                  onCreated={handleCreated}
                />
              </div>
            )}
          </div>
        </>
      )}

      <AssignmentList
        key={listVersion}
        courseId={courseId}
        canSubmit={!canCreate}
      />
    </div>
  );
}