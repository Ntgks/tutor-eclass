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

  useEffect(() => {
    if (loading) return ;

    const target = window.location.hash.slice(1);
    if(!target.startsWith("assignment-")) return;

    document.getElementById(target)?.scrollIntoView({ block: "start" });
  }, [courseId, loading]);

  if (loading) {
    return (
      <p role="status" className="text-sm text-slate-500">
        Φόρτωση εργασιών…
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (assignments.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-brand-200 bg-brand-50/40 p-4 text-sm leading-6 text-slate-500">
        Δεν έχουν προστεθεί ακόμη εργασίες.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {assignments.map((assignment) => (
        <li
          key={assignment.id}
          id={`assignment-${assignment.id}`}
          className="rounded-xl border border-brand-900/10 bg-white"
        >
          <div className="rounded-t-xl border-b border-brand-900/10 bg-brand-50/50 px-4 py-3 sm:px-5">
            <h3 className="break-words text-base font-semibold text-brand-900">
              {assignment.title}
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-600">
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
          </div>

          <div className="p-4 sm:p-5">
            {assignment.instructions && (
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                {assignment.instructions}
              </p>
            )}

            {!canSubmit && (
              <div className={assignment.instructions ? "mt-4" : ""}>
                {editingAssignmentId === assignment.id ? (
                  <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4">
                    <EditAssignmentForm
                      key={assignment.id}
                      courseId={courseId}
                      assignment={assignment}
                      onUpdated={handleAssignmentUpdated}
                      onCancel={() => setEditingAssignmentId(null)}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingAssignmentId(assignment.id)}
                    className="rounded-lg border border-brand-200 px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                    Επεξεργασία εργασίας
                  </button>
                )}
              </div>
            )}

            <div className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6">
              <AssignmentSubmission
                courseId={courseId}
                assignmentId={assignment.id}
                canSubmit={canSubmit}
                dueAt={assignment.dueAt}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}