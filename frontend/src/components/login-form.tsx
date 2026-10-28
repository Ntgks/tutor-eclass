"use client";

import { useState } from "react";

import type { FormEvent } from "react";
import { login, getCurrentUser } from "@/lib/auth";

import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();    
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  async function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();

    if(submitting) return;

    setError(null);
    setSubmitting(true);

    try{
        await login(email, password);
        setPassword("");

        const user = await getCurrentUser();

        if (!user) {
            throw new Error(
                "Η συνεδρία σύνδεσης δεν βρέθηκε. Δοκίμασε ξανά."
            );
        }

        if(user.authorities.includes("ROLE_TEACHER")){
            router.replace("/");
        }else if(user.authorities.includes("ROLE_STUDENT")){
            router.replace("/student");
        }else{
            throw new Error("Ο λογαριασμός δεν έχει αναγνωρισμένο ρόλο.");
        }
    }catch (error){
        setError(
            error instanceof Error
                ? error.message
                : "Παρουσιάστηκε σφάλμα."
        );
    } finally {
        setSubmitting(false);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium">
          Email
        </label>

        <input
          id="login-email"
          type="email"
          autoComplete="username"
          required
          maxLength={320}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2"
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium"
        >
          Κωδικός
        </label>

        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
            {error}
        </p>
      )}

      <button 
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
        >
            {submitting ? "Σύνδεση…" : "Σύνδεση"}
        </button>
    </form>
  );
}