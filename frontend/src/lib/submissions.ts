import type {
  CreateSubmissionRequest,
  Submission,
} from "@/types/submission";

import { getCsrfToken } from "@/lib/csrf";

export async function getSubmission(
  courseId: string,
  assignmentId: string
): Promise<Submission | null> {
  const response = await fetch(
    `/api/courses/${encodeURIComponent(courseId)}/assignments/${encodeURIComponent(assignmentId)}/submissions`,
    {
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (response.status === 401) {
    throw new Error("Χρειάζεται να συνδεθείς ξανά.");
  }

  if (response.status === 403) {
    throw new Error("Δεν επιτρέπεται η πρόσβαση στην υποβολή.");
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Δεν ήταν δυνατή η φόρτωση της υποβολής.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
  }

  return response.json();
}

export async function createSubmission(
  courseId: string,
  assignmentId: string,
  request: CreateSubmissionRequest,
  files: File[]
): Promise<Submission> {
  const csrf = await getCsrfToken();

  const body = new FormData();

  body.append(
    "metadata",
    new Blob([JSON.stringify(request)], {
      type: "application/json",
    })
  );

  for (const file of files) {
    body.append("files", file);
  }

  const response = await fetch(
    `/api/courses/${encodeURIComponent(courseId)}/assignments/${encodeURIComponent(assignmentId)}/submissions`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
      },
      body,
    }
  );

  if (response.status === 400) {
    throw new Error("Έλεγξε τα αρχεία και το σχόλιό σου.");
  }

  if (response.status === 401) {
    throw new Error("Χρειάζεται να συνδεθείς ξανά.");
  }

  if (response.status === 403) {
    throw new Error("Δεν επιτρέπεται η υποβολή σε αυτή την εργασία.");
  }

  if (response.status === 404) {
    throw new Error("Η εργασία δεν βρέθηκε ή δεν έχεις πρόσβαση.");
  }

  if (response.status === 409) {
    throw new Error(
      "Έχει ήδη γίνει υποβολή ή η προθεσμία έχει λήξει."
    );
  }

  if (response.status === 413) {
    throw new Error("Τα αρχεία υπερβαίνουν το επιτρεπόμενο μέγεθος.");
  }

  if (response.status !== 201) {
    throw new Error("Δεν ήταν δυνατή η καταχώριση της υποβολής.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
  }

  return response.json();
}