import Link from "next/link";

import ForgotPasswordForm from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-brand-900/10 bg-white shadow-sm lg:grid-cols-2">
        <aside className="flex flex-col justify-between bg-brand-900 p-6 text-white sm:p-10">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-sm font-bold"
            >
              TE
            </div>

            <p className="text-xl font-semibold tracking-tight">
              Tutor <span className="text-brand-200">eClass</span>
            </p>
          </div>

          <div className="py-10 lg:py-16">
            <p className="text-xs font-semibold tracking-widest text-brand-200">
              ΕΠΙΣΤΡΟΦΗ ΣΤΟΝ ΧΩΡΟ ΣΟΥ
            </p>

            <h2 className="mt-5 max-w-sm text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Συνέχισε από εκεί που έμεινες.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-brand-100">
              Όρισε έναν νέο κωδικό για να επιστρέψεις στα μαθήματα,
              τις σημειώσεις και τις εργασίες σου.
            </p>
          </div>

          <p className="text-xs leading-6 text-brand-200">
            Οργάνωση στη μελέτη. Συνέχεια στην πρόοδο.
          </p>
        </aside>

        <section
          aria-labelledby="forgot-password-title"
          className="flex flex-col justify-center p-6 sm:p-10 lg:p-12"
        >
          <p className="text-xs font-semibold tracking-widest text-brand-700">
            ΕΠΑΝΑΦΟΡΑ ΠΡΟΣΒΑΣΗΣ
          </p>

          <h1
            id="forgot-password-title"
            className="mt-3 text-2xl font-semibold tracking-tight text-brand-900 sm:text-3xl"
          >
            Ξέχασες τον κωδικό σου;
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Συμπλήρωσε το email του λογαριασμού σου για να ζητήσεις
            σύνδεσμο επαναφοράς. Ο σύνδεσμος ισχύει για 30 λεπτά.
          </p>

          <ForgotPasswordForm />

          <Link
            href="/login"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <span aria-hidden="true">←</span>
            Επιστροφή στη σύνδεση
          </Link>
        </section>
      </div>
    </main>
  );
}