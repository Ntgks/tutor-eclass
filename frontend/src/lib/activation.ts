import { getCsrfToken } from "@/lib/csrf";

export interface ActivateAccountRequest {
  token: string;
  password: string;
}

export async function activateAccount(
  request: ActivateAccountRequest
): Promise<void> {
  const csrf = await getCsrfToken();

  const response = await fetch("/api/auth/activate", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      [csrf.headerName]: csrf.token,
    },
    body: JSON.stringify(request),
  });

  if (response.status === 400) {
    throw new Error(
      "Η πρόσκληση είναι άκυρη ή ληγμένη, ή ο κωδικός δεν πληροί τις απαιτήσεις."
    );
  }

  if (response.status === 403) {
    throw new Error("Ανανέωσε τη σελίδα και δοκίμασε ξανά.");
  }

  if (response.status !== 204) {
    throw new Error("Δεν ήταν δυνατή η ενεργοποίηση του λογαριασμού.");
  }
}