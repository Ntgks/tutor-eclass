import type {
  Assignment,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
} from "@/types/assignment";

import { getCsrfToken } from "@/lib/csrf";

export async function getAssignments(
    courseId: string
): Promise<Assignment[]> {
    const response = await fetch(
        `/api/courses/${encodeURIComponent(courseId)}/assignments`,
        {
            credentials: "same-origin",
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        }
    );

    if(response.status === 401){
        throw new Error("Χρειάζεται να συνδεθείς ξανά.");
    }

    if(response.status === 403){
        throw new Error("Δεν επιτρέπεται η πρόσβαση στις εργασίες.");
    }

    if(response.status === 404){
        throw new Error("Το μάθημα δεν βρέθηκε ή δεν έχεις πρόσβαση.");
    }

    if(!response.ok){
        throw new Error("Δεν ήταν δυνατή η φόρτωση των εργασιών.");
    }

    const contentType = response.headers.get("content-type");

    if(!contentType?.includes("application/json")){
        throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
    }

    return response.json();
}

export async function createAssignment(
    courseId: string,
    request: CreateAssignmentRequest
): Promise<Assignment> {
    const csrf = await getCsrfToken();

    const response = await fetch(
        `/api/courses/${encodeURIComponent(courseId)}/assignments`,
        {
            method: "POST",
            credentials: "same-origin",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                [csrf.headerName]: csrf.token,
            },
            body: JSON.stringify(request),
        }
    );

    if(response.status === 400){
        throw new Error(
            "Έλεγξε τα στοιχεία. Αν υπάρχει προθεσμία, πρέπει να είναι μελλοντική."
        );
    }

    if(response.status === 401){
        throw new Error("Χρειάζεται να συνδεθείς ξανά.");
    }

    if(response.status === 403){
        throw new Error("Δεν επιτρέπεται η δημιουργία εργασίας.");
    }

    if(response.status === 404){
        throw new Error("Το μάθημα δεν βρέθηκε ή δεν έχεις πρόσβαση.");
    }

    if(response.status !== 201){
        throw new Error("Δεν ήταν δυνατή η δημιουργία της εργασίας.");
    }

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
        throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
    }

    return response.json();
}

export async function updateAssignment(
  courseId: string,
  assignmentId: string,
  request: UpdateAssignmentRequest
): Promise<Assignment> {
  const csrf = await getCsrfToken();

  const response = await fetch(
    `/api/courses/${encodeURIComponent(courseId)}/assignments/${encodeURIComponent(assignmentId)}`,
    {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        [csrf.headerName]: csrf.token,
      },
      body: JSON.stringify(request),
    }
  );

  if (response.status === 400) {
    throw new Error(
      "Έλεγξε τα στοιχεία. Αν αλλάξεις την προθεσμία, η νέα ημερομηνία πρέπει να είναι μελλοντική."
    );
  }

  if (response.status === 401) {
    throw new Error("Χρειάζεται να συνδεθείς ξανά.");
  }

  if (response.status === 403) {
    throw new Error("Η επεξεργασία επιτρέπεται μόνο στην καθηγήτρια.");
  }

  if (response.status === 404) {
    throw new Error("Η εργασία δεν βρέθηκε ή δεν έχεις πρόσβαση.");
  }

  if (response.status !== 200) {
    throw new Error("Δεν ήταν δυνατή η ενημέρωση της εργασίας.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
  }

  return response.json();
}