import type { CreateStudentRequest, Student } from "@/types/student";
import { getCsrfToken } from "@/lib/csrf";

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