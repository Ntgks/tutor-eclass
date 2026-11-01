"use client";

import { useEffect, useState } from "react";

import { getSubmission } from "@/lib/submissions";
import type { Submission } from "@/types/submission";

import SubmissionDetails from "@/components/submission-details";
import SubmissionForm from "@/components/submission-form";

import ReviewSubmissionForm from "@/components/review-submission-form";

interface AssignmentSubmissionProps {
  courseId: string;
  assignmentId: string;
  canSubmit: boolean;
  dueAt: string | null;
}

export default function AssignmentSubmission({
  courseId,
  assignmentId,
  canSubmit,
  dueAt,
}: AssignmentSubmissionProps) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSubmission() {
      try {
        const data = await getSubmission(courseId, assignmentId);

        if (active) {
          setSubmission(data);
          setError(null);
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

    loadSubmission();

    return () => {
      active = false;
    };
  }, [courseId, assignmentId, version]);

  useEffect(() => {
    function checkDeadline(){
      setExpired(
        dueAt !== null && Date.now() >= new Date(dueAt).getTime()
      );
    }

    const initialCheck = window.setTimeout(checkDeadline, 0);
    const interval = window.setInterval(checkDeadline, 1000);

    return () => {
      window.clearTimeout(initialCheck);
      window.clearInterval(interval);
    };
  }, [dueAt]);

  if (loading) {
    return <p role="status">Φόρτωση υποβολής…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (submission) {
    return(
        <div className="space-y-4">
            <SubmissionDetails
                submission={submission}
                courseId={courseId}
            />

            {!canSubmit && (
                <ReviewSubmissionForm
                    key={submission.id}
                    courseId={courseId}
                    assignmentId={assignmentId}
                    initialFeedback={submission.feedback ?? ""}
                    onReviewed={() => setVersion((value) => value + 1)}
                />
            )}
        </div>
    );
  }

  if (!canSubmit) {
    return <p>Δεν έχει καταχωριστεί ακόμη υποβολή.</p>;
  }

  if(expired) {
    return(
      <p role="status" className="text-sm text-slate-600">
        Η προθεσμία υποβολής έχει λήξει.
      </p>
    );
  }

  return (
    <SubmissionForm
      courseId={courseId}
      assignmentId={assignmentId}
      onSubmitted={() => setVersion((value) => value + 1)}
    />
  );
}