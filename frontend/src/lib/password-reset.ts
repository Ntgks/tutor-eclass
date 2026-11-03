import { getCsrfToken } from "@/lib/csrf";

export async function forgotPassword(email: string): Promise<void> {
  const csrf = await getCsrfToken();

  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      [csrf.headerName]: csrf.token,
    },
    body: JSON.stringify({ email: email.trim() }),
  });

  if (response.status === 400) {
    throw new Error("Συμπλήρωσε μια έγκυρη διεύθυνση email.");
  }

  if (response.status === 403) {
    throw new Error("Ανανέωσε τη σελίδα και δοκίμασε ξανά.");
  }

  if (response.status !== 204) {
    throw new Error(
      "Δεν ήταν δυνατή η επεξεργασία του αιτήματος. Δοκίμασε ξανά."
    );
  }
}

export async function resetPassword(
  token: string,
  password: string
): Promise<void> {
  const csrf = await getCsrfToken();

  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      [csrf.headerName]: csrf.token,
    },
    body: JSON.stringify({ token, password }),
  });

  if (response.status === 400) {
    throw new Error(
      "Ο σύνδεσμος δεν είναι έγκυρος ή έχει λήξει, ή ο κωδικός δεν πληροί τις απαιτήσεις."
    );
  }

  if (response.status === 403) {
    throw new Error("Ανανέωσε τη σελίδα και δοκίμασε ξανά.");
  }

  if (response.status !== 204) {
    throw new Error("Δεν ήταν δυνατή η επαναφορά του κωδικού.");
  }
}