"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import ResetPasswordForm from "@/components/reset-password-form";

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return (
      <div className="mt-6 space-y-5">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-700"
        >
          <p className="font-semibold">
            Ο σύνδεσμος επαναφοράς δεν είναι έγκυρος.
          </p>

          <p className="mt-2">
            Άνοιξε τον πλήρη σύνδεσμο από το email σου ή ζήτησε έναν
            νέο.
          </p>
        </div>

        <Link
          href="/forgot-password"
          className="flex justify-center rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          Αίτημα νέου συνδέσμου
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm key={token} token={token} />;
}