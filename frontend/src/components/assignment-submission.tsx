"use client";

import { useEffect, useState } from "react";

import { getSubmission } from "@/lib/submissions";
import type { Submission } from "@/types/submission";

import SubmissionDetails from "@/components/submission-details";
import SubmissionForm from "@/components/submission-form";

interface AssignmentSubmissionProps {
  courseId: string;
  assignmentId: string;
  canSubmit: boolean;
}

export default function AssignmentSubmission({
  courseId,
  assignmentId,
  canSubmit,
}: AssignmentSubmissionProps) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

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

  if (loading) {
    return <p role="status">Φόρτωση υποβολής…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (submission) {
    return <SubmissionDetails submission={submission} />;
  }

  if (!canSubmit) {
    return <p>Δεν έχει καταχωριστεί ακόμη υποβολή.</p>;
  }

  return (
    <SubmissionForm
      courseId={courseId}
      assignmentId={assignmentId}
      onSubmitted={() => setVersion((value) => value + 1)}
    />
  );
}