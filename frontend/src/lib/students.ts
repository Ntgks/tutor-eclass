import { getCsrfToken } from "@/lib/csrf";

import type {
  CreateStudentRequest,
  Student,
  UpdateStudentRequest,
} from "@/types/student";

export async function getStudents(): Promise<Student[]> {
  const response = await fetch("/api/students", {
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Δεν ήταν δυνατή η φόρτωση των μαθητών.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Χρειάζεται σύνδεση για να δεις τους μαθητές.");
  }

  return response.json();
}

export async function createStudent(
    request: CreateStudentRequest
): Promise<Student> {
    const csrf = await getCsrfToken();

    const response = await fetch("/api/students", {
        method: "POST",
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            [csrf.headerName]: csrf.token,
        },
        body: JSON.stringify(request),
    });

    if(response.status === 409){
        throw new Error("Υπάρχει ήδη χρήστης με αυτό το email.");
    }

    if(response.status === 400){
        throw new Error("Έλεγξε τα στοιχεία του μαθητή.");
    }

    if(response.status === 401 || response.status === 403){
        throw new Error("Η σύνδεση ή τα δικαιώματά σου δεν επιτρέπουν αυτή την ενέργεια.");
    }

    if(!response.ok){
        throw new Error("Δεν ήταν δυνατή η δημιουργία του μαθητή.");
    }

    const contentType = response.headers.get("content-type");

    if(!contentType?.includes("application/json")){
        throw new Error("Χρειάζεται να συνδεθείς ξανά.");
    }

    return response.json();
}

export async function updateStudent(
  studentId: string,
  request: UpdateStudentRequest
): Promise<Student> {
  const csrf = await getCsrfToken();

  const response = await fetch(
    `/api/students/${encodeURIComponent(studentId)}`,
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
    throw new Error("Έλεγξε τα στοιχεία του μαθητή.");
  }

  if (response.status === 401) {
    throw new Error("Χρειάζεται να συνδεθείς ξανά.");
  }

  if (response.status === 403) {
    throw new Error("Η επεξεργασία επιτρέπεται μόνο στην καθηγήτρια.");
  }

  if (response.status === 404) {
    throw new Error("Ο μαθητής δεν βρέθηκε.");
  }

  if (response.status === 409) {
    throw new Error("Το email χρησιμοποιείται ήδη ή υπάρχει σύγκρουση στοιχείων.");
  }

  if (response.status !== 200) {
    throw new Error("Δεν ήταν δυνατή η ενημέρωση του μαθητή.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
  }

  return response.json();
}

export async function disableStudent(studentId: string): Promise<Student> {
  const csrf = await getCsrfToken();

  const response = await fetch(
    `/api/students/${encodeURIComponent(studentId)}/disable`,
    {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
      },
    }
  );

  if (response.status === 401) {
    throw new Error("Χρειάζεται να συνδεθείς ξανά.");
  }

  if (response.status === 403) {
    throw new Error("Η απενεργοποίηση επιτρέπεται μόνο στην καθηγήτρια.");
  }

  if (response.status === 404) {
    throw new Error("Ο μαθητής δεν βρέθηκε.");
  }

  if (response.status !== 200) {
    throw new Error("Δεν ήταν δυνατή η απενεργοποίηση του μαθητή.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
  }

  return response.json();
}

export async function enableStudent(studentId: string): Promise<Student> {
  const csrf = await getCsrfToken();

  const response = await fetch(
    `/api/students/${encodeURIComponent(studentId)}/enable`,
    {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        [csrf.headerName]: csrf.token,
      },
    }
  );

  if (response.status === 401) {
    throw new Error("Χρειάζεται να συνδεθείς ξανά.");
  }

  if (response.status === 403) {
    throw new Error("Η επανενεργοποίηση επιτρέπεται μόνο στην καθηγήτρια.");
  }

  if (response.status === 404) {
    throw new Error("Ο μαθητής δεν βρέθηκε.");
  }

  if (response.status === 409) {
    throw new Error("Ο μαθητής δεν είναι απενεργοποιημένος. Ανανέωσε τη σελίδα.");
  }

  if (response.status !== 200) {
    throw new Error("Δεν ήταν δυνατή η επανενεργοποίηση του μαθητή.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
  }

  return response.json();
}