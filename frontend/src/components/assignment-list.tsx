"use client";

import { useEffect, useRef, useState } from "react";

import { getAssignments } from "@/lib/assignments";
import { getSubmission } from "@/lib/submissions";

import type { Assignment } from "@/types/assignment";
import type { Submission } from "@/types/submission";

import EditAssignmentForm from "@/components/edit-assignment-form";
import SubmissionDetails from "@/components/submission-details";
import SubmissionForm from "@/components/submission-form";
import ReviewSubmissionForm from "@/components/review-submission-form";

interface AssignmentListProps {
  courseId: string;
  canSubmit: boolean;
}

interface AssignmentCardProps extends AssignmentListProps {
  assignment: Assignment;
  onUpdated: (assignment: Assignment) => void;
}

const deadlineFormat = new Intl.DateTimeFormat("el-GR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Athens",
});

function AssignmentCard({
  courseId,
  assignment,
  canSubmit,
  onUpdated,
}: AssignmentCardProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [editing, setEditing] = useState(false);
  const [expired, setExpired] = useState(false);

  const targetId = `assignment-${assignment.id}`;

  function refreshSubmission() {
    setLoading(true);
    setError(null);
    setVersion((current) => current + 1);
  }

  function handleUpdated(updatedAssignment: Assignment) {
    setEditing(false);
    onUpdated(updatedAssignment);
  }

  useEffect(() => {
    let active = true;

    async function loadSubmission() {
      try {
        const data = await getSubmission(courseId, assignment.id);

        if (active) {
          setSubmission(data);
          setError(null);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Δεν ήταν δυνατή η φόρτωση της υποβολής."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSubmission();

    return () => {
      active = false;
    };
  }, [courseId, assignment.id, version]);

  useEffect(() => {
    function checkDeadline() {
      setExpired(
        assignment.dueAt !== null &&
          Date.now() >= new Date(assignment.dueAt).getTime()
      );
    }

    const initialCheck = window.setTimeout(checkDeadline, 0);
    const interval = window.setInterval(checkDeadline, 1000);

    return () => {
      window.clearTimeout(initialCheck);
      window.clearInterval(interval);
    };
  }, [assignment.dueAt]);

  useEffect(() => {
    let frame: number | undefined;

    function openLinkedAssignment() {
      if (window.location.hash !== `#${targetId}`) return;

      if (detailsRef.current) {
        detailsRef.current.open = true;
      }

      frame = window.requestAnimationFrame(() => {
        detailsRef.current?.scrollIntoView({
          block: "start",
        });
      });
    }

    openLinkedAssignment();

    window.addEventListener("hashchange", openLinkedAssignment);

    return () => {
      window.removeEventListener("hashchange", openLinkedAssignment);

      if (frame !== undefined) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [targetId]);

  let statusLabel: string;
  let statusStyle: string;

  if (loading) {
    statusLabel = "Έλεγχος υποβολής…";
    statusStyle = "bg-slate-50 text-slate-500 ring-slate-200";
  } else if (error) {
    statusLabel = "Μη διαθέσιμη κατάσταση";
    statusStyle = "bg-slate-50 text-slate-600 ring-slate-200";
  } else if (submission?.reviewedAt) {
    statusLabel = "Ελέγχθηκε";
    statusStyle = "bg-emerald-50 text-emerald-800 ring-emerald-200";
  } else if (submission) {
    statusLabel = "Αναμονή διόρθωσης";
    statusStyle = "bg-amber-50 text-amber-800 ring-amber-200";
  } else if (expired) {
    statusLabel = "Η προθεσμία έληξε";
    statusStyle = "bg-rose-50 text-rose-700 ring-rose-200";
  } else {
    statusLabel = canSubmit ? "Προς υποβολή" : "Χωρίς υποβολή";
    statusStyle = "bg-brand-50 text-brand-700 ring-brand-200";
  }

  return (
    <li>
      <details
        ref={detailsRef}
        id={targetId}
        className="group scroll-mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors open:border-brand-200"
      >
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-4 p-5 transition-colors hover:bg-brand-50/40 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand-600 [&::-webkit-details-marker]:hidden">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-5 w-5"
            >
              <rect x="4" y="4" width="16" height="17" rx="2" />
              <path
                d="M9 3h6v4H9zM8 12h8M8 16h5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span className="min-w-0 flex-1 basis-48">
            <span className="block break-words text-sm font-semibold text-brand-900">
              {assignment.title}
            </span>

            <span className="mt-1 block text-xs leading-5 text-slate-500">
              {assignment.dueAt ? (
                <>
                  Προθεσμία:{" "}
                  <time dateTime={assignment.dueAt}>
                    {deadlineFormat.format(new Date(assignment.dueAt))}
                  </time>
                  {" · ώρα Ελλάδας"}
                </>
              ) : (
                "Χωρίς προθεσμία"
              )}
            </span>
          </span>

          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyle}`}
          >
            {statusLabel}
          </span>

          <span className="ml-auto inline-flex items-center gap-2 text-xs font-semibold text-brand-700">
            <span className="group-open:hidden">Άνοιγμα</span>
            <span className="hidden group-open:inline">Κλείσιμο</span>

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

        <div className="space-y-6 border-t border-slate-100 p-5 sm:p-6">
          {assignment.instructions && (
            <div>
              <h3 className="text-sm font-semibold text-brand-900">
                Οδηγίες εργασίας
              </h3>

              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                {assignment.instructions}
              </p>
            </div>
          )}

          {!canSubmit && (
            <div>
              {editing ? (
                <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4">
                  <EditAssignmentForm
                    key={assignment.id}
                    courseId={courseId}
                    assignment={assignment}
                    onUpdated={handleUpdated}
                    onCancel={() => setEditing(false)}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-lg border border-brand-200 px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  Επεξεργασία εργασίας
                </button>
              )}
            </div>
          )}

          <div className="border-t border-slate-100 pt-5 text-sm leading-6">
            {loading ? (
              <p role="status" className="text-slate-500">
                Φόρτωση υποβολής…
              </p>
            ) : error ? (
              <div>
                <p role="alert" className="text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={refreshSubmission}
                  className="mt-3 rounded-lg border border-brand-200 px-3 py-2 font-semibold text-brand-700 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  Δοκίμασε ξανά
                </button>
              </div>
            ) : submission ? (
              <div className="space-y-4">
                <SubmissionDetails
                  submission={submission}
                  courseId={courseId}
                />

                {!canSubmit && (
                  <ReviewSubmissionForm
                    key={`${submission.id}-${version}`}
                    courseId={courseId}
                    assignmentId={assignment.id}
                    initialFeedback={submission.feedback ?? ""}
                    onReviewed={refreshSubmission}
                  />
                )}
              </div>
            ) : !canSubmit ? (
              <p className="text-slate-500">
                Δεν έχει καταχωριστεί ακόμη υποβολή.
              </p>
            ) : expired ? (
              <p
                role="status"
                className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700"
              >
                Η προθεσμία υποβολής έχει λήξει.
              </p>
            ) : (
              <div>
                <h3 className="text-sm font-semibold text-brand-900">
                  Η υποβολή σου
                </h3>

                <p className="mb-5 mt-1 text-sm text-slate-500">
                  Πρόσθεσε τις λύσεις σου ως φωτογραφίες ή PDF.
                </p>

                <SubmissionForm
                  courseId={courseId}
                  assignmentId={assignment.id}
                  onSubmitted={refreshSubmission}
                />
              </div>
            )}
          </div>
        </div>
      </details>
    </li>
  );
}

export default function AssignmentList({
  courseId,
  canSubmit,
}: AssignmentListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleAssignmentUpdated(updatedAssignment: Assignment) {
    setAssignments((current) =>
      current.map((assignment) =>
        assignment.id === updatedAssignment.id
          ? updatedAssignment
          : assignment
      )
    );
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
              : "Δεν ήταν δυνατή η φόρτωση των εργασιών."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadAssignments();

    return () => {
      active = false;
    };
  }, [courseId]);

  if (loading) {
    return (
      <p role="status" className="text-sm text-slate-500">
        Φόρτωση εργασιών…
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

  if (assignments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-6">
        <p className="text-sm font-semibold text-brand-900">
          Δεν υπάρχουν ακόμη εργασίες.
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {canSubmit
            ? "Οι νέες εργασίες της καθηγήτριάς σου θα εμφανίζονται εδώ."
            : "Πάτησε «Νέα εργασία» για να προσθέσεις την πρώτη."}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          courseId={courseId}
          assignment={assignment}
          canSubmit={canSubmit}
          onUpdated={handleAssignmentUpdated}
        />
      ))}
    </ul>
  );
}