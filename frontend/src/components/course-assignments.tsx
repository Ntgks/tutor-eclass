"use client";

import { useState } from "react";

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
  const [listVersion, setListVersion] = useState(0);

  return (
    <div className="space-y-6">
      {canCreate && (
        <CreateAssignmentForm
          courseId={courseId}
          onCreated={() => setListVersion((version) => version + 1)}
        />
      )}

      <AssignmentList
        key={listVersion}
        courseId={courseId}
        canSubmit={!canCreate}
        />
    </div>
  );
}