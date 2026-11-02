"use client";

import { useEffect, useState } from "react";

import { getAssignments } from "@/lib/assignments";
import type { Assignment } from "@/types/assignment";
import AssignmentSubmission from "@/components/assignment-submission";
import EditAssignmentForm from "@/components/edit-assignment-form";

interface AssignmentListProps {
  courseId: string;
  canSubmit: boolean;
}

export default function AssignmentList({
  courseId,
  canSubmit,
}: AssignmentListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAssignmentId, setEditingAssignmentId] =
    useState<string | null>(null);
  
  function handleAssignmentUpdated(updatedAssignment: Assignment) {
    setAssignments((current) =>
      current.map((assignment) =>
        assignment.id === updatedAssignment.id
          ? updatedAssignment
          : assignment
      ) 
    );

    setEditingAssignmentId(null);
  }

  useEffect(() => {
    let active = true;

    async function loadAssignments() {
      try {
        const data = await getAssignments(courseId);

        if (active) {
          setAssignments(data);
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

    loadAssignments();

    return () => {
      active = false;
    };
  }, [courseId]);

  if (loading) {
    return <p role="status">Φόρτωση εργασιών…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (assignments.length === 0) {
    return <p>Δεν έχουν προστεθεί ακόμη εργασίες.</p>;
  }

  return (
    <ul className="space-y-3">
      {assignments.map((assignment) => (
        <li
          key={assignment.id}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <h3 className="font-semibold">{assignment.title}</h3>

          {assignment.instructions && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
              {assignment.instructions}
            </p>
          )}

          <p className="mt-3 text-sm font-medium text-indigo-700">
            {assignment.dueAt
              ? `Προθεσμία (ώρα Ελλάδας): ${new Date(
                  assignment.dueAt
                ).toLocaleString("el-GR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Europe/Athens",
                })}`
              : "Χωρίς προθεσμία"}
          </p>

          {!canSubmit && (
            <div className="mt-4">
              {editingAssignmentId === assignment.id ? (
                <EditAssignmentForm
                  key={assignment.id}
                  courseId={courseId}
                  assignment={assignment}
                  onUpdated={handleAssignmentUpdated}
                  onCancel={() => setEditingAssignmentId(null)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingAssignmentId(assignment.id)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100"
                >
                  Επεξεργασία εργασίας
                </button>
              )}
            </div>
          )}

          <div className="mt-4 border-t border-slate-200 pt-4">
            <AssignmentSubmission
                courseId={courseId}
                assignmentId={assignment.id}
                canSubmit={canSubmit}
                dueAt={assignment.dueAt}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}