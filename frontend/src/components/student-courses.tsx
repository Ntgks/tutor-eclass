"use client";

import { useId, useState } from "react";

import CourseList from "@/components/course-list";
import CreateCourseForm from "@/components/create-course-form";

interface StudentCoursesProps {
  studentId: string;
}

export default function StudentCourses({
  studentId,
}: StudentCoursesProps) {
  const formId = useId();
  const [listVersion, setListVersion] = useState(0);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setShowForm((current) => !current)}
        aria-expanded={showForm}
        aria-controls={formId}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100"
      >
        {showForm ? "Κλείσιμο φόρμας" : "+ Νέο μάθημα"}
      </button>

      <div id={formId} hidden={!showForm}>
        {showForm && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <CreateCourseForm
              studentId={studentId}
              onCreated={() => {
                setListVersion((version) => version + 1);
                setShowForm(false);
              }}
            />
          </div>
        )}
      </div>

      <CourseList key={listVersion} studentId={studentId} />
    </div>
  );
}