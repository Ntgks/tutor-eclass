import StudentManagement from "@/components/student-management";
import RequireRole from "@/components/require-role";
import LogoutButton from "@/components/logout-button";
import PendingReviews from "@/components/pending-reviews";

import Link from "next/link";

export default function Home() {
  return (
    <RequireRole role="ROLE_TEACHER">
      <main className="min-h-screen bg-background text-foreground">
        <header className="border-b-4 border-brand-500 bg-brand-900">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-sm font-bold tracking-wide text-white"
              >
                TE
              </div>

              <div>
                <p className="text-xl font-semibold tracking-tight text-white">
                  Tutor <span className="text-brand-200">eClass</span>
                </p>

                <p className="mt-1 text-xs text-brand-100">
                  Χώρος καθηγήτριας
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/account/password"
                className="rounded-lg border border-white/25 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Αλλαγή κωδικού
              </Link>
              <div className="rounded-lg bg-white">
                <LogoutButton />
              </div>
            </div>

          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mb-8 border-b border-brand-900/10 pb-7">
            <div className="mb-3 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-brand-500"
              />

              <p className="text-xs font-semibold tracking-widest text-brand-700">
                Ο ΠΡΟΣΩΠΙΚΟΣ ΣΟΥ ΧΩΡΟΣ
              </p>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-brand-900 sm:text-4xl">
              Διαχείριση μαθητών
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Οι μαθητές σου, η πρόοδός τους και το επόμενο μάθημα.
              Όλα οργανωμένα σε έναν χώρο.
            </p>
          </div>


          <PendingReviews />
          <StudentManagement />
        </div>
      </main>
    </RequireRole>
  );
}