"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { login, getCurrentUser } from "@/lib/auth";

import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const formId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      setPassword("");

      const user = await getCurrentUser();

      if (!user) {
        throw new Error(
          "Η συνεδρία σύνδεσης δεν βρέθηκε. Δοκίμασε ξανά."
        );
      }

      if (user.authorities.includes("ROLE_TEACHER")) {
        router.replace("/");
      } else if (user.authorities.includes("ROLE_STUDENT")) {
        router.replace("/student");
      } else {
        throw new Error("Ο λογαριασμός δεν έχει αναγνωρισμένο ρόλο.");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Παρουσιάστηκε σφάλμα."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClassName =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

  return (
    <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor={`${formId}-email`}
          className="block text-sm font-medium text-slate-700"
        >
          Email
        </label>

        <input
          id={`${formId}-email`}
          name="username"
          type="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          disabled={submitting}
          maxLength={320}
          placeholder="name@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-password`}
          className="block text-sm font-medium text-slate-700"
        >
          Κωδικός πρόσβασης
        </label>

        <input
          id={`${formId}-password`}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={submitting}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClassName}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Σύνδεση…" : "Σύνδεση στον χώρο μου"}

        {!submitting && <span aria-hidden="true">→</span>}
      </button>

      <div className="text-center">
        <Link
          href="/forgot-password"
          className="rounded text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          Ξέχασα τον κωδικό μου
        </Link>
      </div>
    </form>
  );
}