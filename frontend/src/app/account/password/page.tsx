import Link from "next/link";

import RequireRole from "@/components/require-role";
import LogoutButton from "@/components/logout-button";
import ChangePasswordForm from "@/components/change-password-form";

export default function ChangePasswordPage() {
  return (
    <RequireRole role="ANY">
      <main className="min-h-screen bg-background text-foreground">
        <header className="border-b-4 border-brand-500 bg-brand-900">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
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
                  Ρυθμίσεις λογαριασμού
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-white">
              <LogoutButton />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md py-2 text-sm font-semibold text-brand-700 hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <span aria-hidden="true">←</span>
            Επιστροφή στον χώρο μου
          </Link>

          <section
            className="mt-6 max-w-2xl rounded-2xl border border-brand-900/10 bg-white p-5 shadow-sm sm:p-7"
            aria-labelledby="password-title"
          >
            <h1
              id="password-title"
              className="text-2xl font-semibold tracking-tight text-brand-900"
            >
              Αλλαγή κωδικού
            </h1>

            <p className="mb-6 mt-3 text-sm leading-7 text-slate-500">
              Συμπλήρωσε τον τωρινό κωδικό σου και όρισε έναν νέο
              για την πρόσβαση στον λογαριασμό σου.
            </p>

            <ChangePasswordForm />
          </section>
        </div>
      </main>
    </RequireRole>
  );
}