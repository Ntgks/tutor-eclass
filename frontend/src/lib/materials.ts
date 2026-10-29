import type { CreateMaterialRequest, Material } from "@/types/material";
import { getCsrfToken } from "@/lib/csrf";

export async function getMaterials(
  courseId: string
): Promise<Material[]> {
  const response = await fetch(
    `/api/courses/${encodeURIComponent(courseId)}/materials`,
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
    throw new Error("Δεν επιτρέπεται η πρόσβαση στο υλικό.");
  }

  if (response.status === 404) {
    throw new Error("Το μάθημα δεν βρέθηκε ή δεν έχεις πρόσβαση.");
  }

  if (!response.ok) {
    throw new Error("Δεν ήταν δυνατή η φόρτωση του υλικού.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
  }

  return response.json();
}

export async function uploadMaterial(
  courseId: string,
  request: CreateMaterialRequest,
  file: File
): Promise<Material> {
  const csrf = await getCsrfToken();

  const body = new FormData();

  body.append(
    "metadata",
    new Blob([JSON.stringify(request)], {
      type: "application/json",
    })
  );

  body.append("file", file);

  const response = await fetch(
    `/api/courses/${encodeURIComponent(courseId)}/materials`,
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
    throw new Error("Έλεγξε τον τίτλο και το αρχείο.");
  }

  if (response.status === 401) {
    throw new Error("Χρειάζεται να συνδεθείς ξανά.");
  }

  if (response.status === 403) {
    throw new Error("Δεν επιτρέπεται το ανέβασμα αρχείου.");
  }

  if (response.status === 404) {
    throw new Error("Το μάθημα δεν βρέθηκε ή δεν έχεις πρόσβαση.");
  }

  if (response.status === 413) {
    throw new Error("Το αρχείο υπερβαίνει το όριο των 10 MB.");
  }

  if (response.status !== 201) {
    throw new Error("Δεν ήταν δυνατό το ανέβασμα του αρχείου.");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error("Η υπηρεσία επέστρεψε μη αναμενόμενη απάντηση.");
  }

  return response.json();
}