"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import ActivationForm from "@/components/activation-form";

export default function ActivationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return (
      <div className="space-y-5">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
        >
          <p className="font-semibold">
            Ο σύνδεσμος ενεργοποίησης δεν είναι έγκυρος.
          </p>

          <p className="mt-2">
            Άνοιξε τον πλήρη σύνδεσμο πρόσκλησης που σου έδωσε
            η καθηγήτριά σου.
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <span aria-hidden="true">←</span>
          Επιστροφή στη σύνδεση
        </Link>
      </div>
    );
  }

  return <ActivationForm key={token} token={token} />;
}