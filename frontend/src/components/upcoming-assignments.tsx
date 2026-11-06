"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UpcomingAssignment = {
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  courseTitle: string;
  dueAt: string;
};

const deadlineFormat = new Intl.DateTimeFormat("el-GR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Athens",
});

export default function UpcomingAssignments() {
  const [assignments, setAssignments] = useState<UpcomingAssignment[] | null>(
    null
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAssignments() {
      try {
        const response = await fetch("/api/me/assignments/upcoming", {
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: UpcomingAssignment[] = await response.json();

        if (!controller.signal.aborted) {
          setAssignments(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setFailed(true);
        }
      }
    }

    void loadAssignments();
    return () => controller.abort();
  }, []);

  return (
    <section
      aria-labelledby="upcoming-assignments-heading"
      className="mb-8 rounded-2xl border border-brand-900/10 bg-white p-6 shadow-sm"
    >
      <h2
        id="upcoming-assignments-heading"
        className="text-xl font-semibold text-brand-900"
      >
        Επόμενες προθεσμίες
      </h2>

      {failed ? (
        <p role="alert" className="mt-3 text-sm text-red-700">
          Δεν ήταν δυνατή η φόρτωση των προθεσμιών.
        </p>
      ) : assignments === null ? (
        <p role="status" className="mt-3 text-sm text-slate-600">
          Φόρτωση προθεσμιών…
        </p>
      ) : assignments.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">
          Δεν έχεις εργασίες με επερχόμενη προθεσμία.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-brand-900/10">
          {assignments.map((assignment) => (
            <li
              key={assignment.assignmentId}
              className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 py-3"
            >
              <div className="min-w-0">
                <Link
                  href={`/courses/${assignment.courseId}`}
                  className="break-words font-semibold text-brand-700 hover:underline"
                >
                  {assignment.assignmentTitle}
                </Link>
                <p className="break-words text-sm text-slate-600">
                  {assignment.courseTitle}
                </p>
              </div>

              <time
                dateTime={assignment.dueAt}
                className="text-sm font-medium text-brand-900"
              >
                {deadlineFormat.format(new Date(assignment.dueAt))}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}