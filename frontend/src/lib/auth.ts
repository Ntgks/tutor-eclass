import { getCsrfToken } from "@/lib/csrf";

export async function login(
  email: string,
  password: string
): Promise<void> {
  const csrf = await getCsrfToken();

  const body = new URLSearchParams({
    username: email.trim(),
    password,
  });

  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      [csrf.headerName]: csrf.token,
    },
    body: body.toString(),
  });

  if (response.status === 401) {
    throw new Error("Μη έγκυρο email ή κωδικός.");
  }

  if (response.status === 403) {
    throw new Error("Ανανέωσε τη σελίδα και δοκίμασε ξανά.");
  }

  if (response.status !== 204) {
    throw new Error("Δεν ήταν δυνατή η σύνδεση.");
  }
}

export interface AuthenticatedUser {
    email: string;
    authorities: string[];
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
    const response = await fetch("/api/auth/me", {
        credentials: "same-origin",
        cache: "no-store",
        headers: {
            Accept: "application/json",
        },
    });

    if(response.status === 401){
        return null;
    }

    if(!response.ok){
        throw new Error("Δεν ήταν δυνατή η ανάκτηση του λογαριασμού.");
    }

    const contentType = response.headers.get("content-type");

    if(!contentType?.includes("application/json")){
        throw new Error("Χρειάζεται να συνδεθείς ξανά.");
    }

    return response.json();
}

export async function logout(): Promise<void> {
  const csrf = await getCsrfToken();

  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      [csrf.headerName]: csrf.token,
    },
  });

  if(response.status === 403){
    throw new Error("Ανανέωσε τη σελίδα και δοκίμασε ξανά.");
  }

  if(response.status !== 204){
    throw new Error("Δεν ήταν δυνατή η αποσύνδεση.");
  }
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(
  request: ChangePasswordRequest
): Promise<void> {
  const csrf = await getCsrfToken();

  const response = await fetch("/api/auth/password", {
    method: "PUT",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      [csrf.headerName]: csrf.token,
    },
    body: JSON.stringify(request),
  });

  if (response.status === 400) {
    throw new Error(
      "Έλεγξε τον τωρινό κωδικό. Ο νέος πρέπει να έχει 12–64 χαρακτήρες και έως 72 bytes."
    );
  }

  if (response.status === 401) {
    throw new Error("Χρειάζεται να συνδεθείς ξανά.");
  }

  if (response.status === 403) {
    throw new Error(
      "Δεν επιτρέπεται η αλλαγή κωδικού. Ανανέωσε τη σελίδα και δοκίμασε ξανά."
    );
  }

  if (response.status !== 204) {
    throw new Error("Δεν ήταν δυνατή η αλλαγή του κωδικού.");
  }
}