import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "@/types/course";
import { getCsrfToken } from "@/lib/csrf";

export async function getStudentCourses(
    studentId: string
): Promise<Course[]> {
    const response = await fetch(
        `/api/students/${encodeURIComponent(studentId)}/courses`,
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
        throw new Error("Δεν έχεις δικαίωμα προβολής αυτών των μαθημάτων.");
    }

    if(response.status === 404){
        throw new Error("Ο μαθητής δεν βρέθηκε.");
    }

    if(!response.ok){
        throw new Error("Δεν ήταν δυνατή η φόρτωση των μαθημάτων.");
    }

    const contentType = response.headers.get("content-type");

    if(!contentType?.includes("application/json")){
        throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
    }

    return response.json();
}

export async function createCourse(
    studentId: string,
    request: CreateCourseRequest
): Promise<Course> {
    const csrf = await getCsrfToken();

    const response = await fetch(
        `/api/students/${encodeURIComponent(studentId)}/courses`,
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
        throw new Error("Έλεγξε τον τίτλο και την περιγραφή.");
    }

    if(response.status === 401){
        throw new Error("Χρειάζεται να συνδεθείς ξανά.");
    }

    if(response.status === 403){
        throw new Error("Δεν επιτρέπεται η δημιουργία μαθήματος.");
    }

    if(response.status === 404){
        throw new Error("Ο μαθητής δεν βρέθηκε.");
    }

    if(response.status === 409){
        throw new Error("Δεν μπορεί να δημιουργηθεί μάθημα για αυτόν τον λογαριασμό.");
    }

    if(response.status !== 201){
        throw new Error("Δεν ήταν δυνατή η δημιουργία του μαθήματος.");
    }

    return response.json();
}

export async function getMyCourses(): Promise<Course[]> {
  const response = await fetch("/api/me/courses", {
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 401) {
    throw new Error("Χρειάζεται να συνδεθείς ξανά.");
  }

  if (response.status === 403) {
    throw new Error("Δεν επιτρέπεται η πρόσβαση στα μαθήματα.");
  }

  if (!response.ok) {
    throw new Error("Δεν ήταν δυνατή η φόρτωση των μαθημάτων σου.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
  }

  return response.json();
}

export async function getCourse(courseId: string): Promise<Course> {
    const response = await fetch(
        `/api/courses/${encodeURIComponent(courseId)}`,
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
        throw new Error("Δεν επιτρέπεται η πρόσβαση στο μάθημα.");
    }

    if(response.status === 404){
        throw new Error("Το μάθημα δεν βρέθηκε ή δεν έχεις πρόσβαση.");
    }

    if(!response.ok){
        throw new Error("Δεν ήταν δυνατή η φόρτωση του μαθήματος.");
    }

    const contentType = response.headers.get("content-type");

    if(!contentType?.includes("application/json")){
        throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
    }

    return response.json();
}

export async function updateCourse(
  courseId: string,
  request: UpdateCourseRequest
): Promise<Course> {
  const csrf = await getCsrfToken();

  const response = await fetch(
    `/api/courses/${encodeURIComponent(courseId)}`,
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
    throw new Error("Έλεγξε τον τίτλο και την περιγραφή.");
  }

  if (response.status === 401) {
    throw new Error("Χρειάζεται να συνδεθείς ξανά.");
  }

  if (response.status === 403) {
    throw new Error("Η επεξεργασία επιτρέπεται μόνο στην καθηγήτρια.");
  }

  if (response.status === 404) {
    throw new Error("Το μάθημα δεν βρέθηκε ή δεν έχεις πρόσβαση.");
  }

  if (response.status !== 200) {
    throw new Error("Δεν ήταν δυνατή η ενημέρωση του μαθήματος.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
  }

  return response.json();
}

export async function archiveCourse(courseId: string): Promise<Course> {
  const csrf = await getCsrfToken();

  const response = await fetch(
    `/api/courses/${encodeURIComponent(courseId)}/archive`,
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
    throw new Error("Η αρχειοθέτηση επιτρέπεται μόνο στην καθηγήτρια.");
  }

  if (response.status === 404) {
    throw new Error("Το μάθημα δεν βρέθηκε.");
  }

  if (response.status !== 200) {
    throw new Error("Δεν ήταν δυνατή η αρχειοθέτηση του μαθήματος.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
  }

  return response.json();
}

export async function restoreCourse(courseId: string): Promise<Course> {
  const csrf = await getCsrfToken();

  const response = await fetch(
    `/api/courses/${encodeURIComponent(courseId)}/restore`,
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
    throw new Error("Η επαναφορά επιτρέπεται μόνο στην καθηγήτρια.");
  }

  if (response.status === 404) {
    throw new Error("Το μάθημα δεν βρέθηκε.");
  }

  if (response.status !== 200) {
    throw new Error("Δεν ήταν δυνατή η επαναφορά του μαθήματος.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
  }

  return response.json();
}