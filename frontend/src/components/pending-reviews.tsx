"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PendingReview = {
  submissionId: string;
  studentName: string;
  assignmentTitle: string;
  courseId: string;
  courseTitle: string;
  submittedAt: string;
};

const submittedAtFormat = new Intl.DateTimeFormat("el-GR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Athens",
});

export default function PendingReviews() {
  const [reviews, setReviews] = useState<PendingReview[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReviews() {
      try {
        const response = await fetch(
          "/api/teacher/submissions/pending-review",
          {
            credentials: "same-origin",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: PendingReview[] = await response.json();
        if (!controller.signal.aborted) {
          setReviews(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setFailed(true);
        }
      }
    }

    void loadReviews();
    return () => controller.abort();
  }, []);

  return (
    <section
      aria-labelledby="pending-reviews-title"
      className="mb-8 rounded-2xl border border-brand-900/10 bg-white p-6 shadow-sm"
    >
      <h2
        id="pending-reviews-title"
        className="text-xl font-semibold text-brand-900"
      >
        Υποβολές για διόρθωση
      </h2>

      {failed ? (
        <p role="alert" className="mt-3 text-sm text-red-700">
          Δεν ήταν δυνατή η φόρτωση των υποβολών.
        </p>
      ) : reviews === null ? (
        <p role="status" className="mt-3 text-sm text-slate-600">
          Φόρτωση υποβολών…
        </p>
      ) : reviews.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">
          Δεν υπάρχουν υποβολές που περιμένουν διόρθωση.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-brand-900/10">
          {reviews.map((review) => (
            <li
              key={review.submissionId}
              className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 py-3"
            >
              <div className="min-w-0">
                <Link
                  href={`/courses/${review.courseId}`}
                  className="break-words font-semibold text-brand-700 hover:underline"
                >
                  {review.assignmentTitle}
                </Link>
                <p className="break-words text-sm text-slate-600">
                  {review.studentName} · {review.courseTitle}
                </p>
              </div>

              <time
                dateTime={review.submittedAt}
                className="text-sm font-medium text-brand-900"
              >
                {submittedAtFormat.format(new Date(review.submittedAt))}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}