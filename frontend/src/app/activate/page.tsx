import { Suspense } from "react";

import ActivationContent from "@/components/activation-content";

export default function ActivatePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <div className="grid w-full max-w-5xl rounded-3xl border border-brand-900/10 bg-white shadow-sm md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-t-3xl bg-brand-900 p-7 text-white sm:p-10 md:rounded-l-3xl md:rounded-tr-none">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-sm font-bold tracking-wide"
            >
              TE
            </div>

            <p className="text-xl font-semibold tracking-tight">
              Tutor <span className="text-brand-200">eClass</span>
            </p>
          </div>

          <div className="mt-10 md:my-16">
            <p className="text-xs font-semibold tracking-widest text-brand-200">
              ΤΟ ΠΡΩΤΟ ΣΟΥ ΒΗΜΑ
            </p>

            <h2 className="mt-4 max-w-sm text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Ο δικός σου χώρος μάθησης.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-brand-100">
              Ενεργοποίησε τον λογαριασμό σου για να βρίσκεις
              τα μαθήματα, τις σημειώσεις και τις εργασίες σου.
            </p>
          </div>

          <p className="mt-8 hidden text-xs leading-6 text-brand-200 md:block">
            Οργάνωση στη μελέτη. Συνέχεια στην πρόοδο.
          </p>
        </div>

        <div className="flex items-center p-7 sm:p-10 lg:p-12">
          <div className="w-full">
            <p className="text-xs font-semibold tracking-widest text-brand-700">
              ΚΑΛΩΣ ΗΡΘΕΣ
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-brand-900 sm:text-3xl">
              Ενεργοποίηση λογαριασμού
            </h1>

            <p className="mb-7 mt-3 text-sm leading-7 text-slate-500">
              Όρισε τον προσωπικό σου κωδικό για την πρόσβαση
              στον λογαριασμό σου.
            </p>

            <Suspense
              fallback={
                <p role="status" className="text-sm text-slate-500">
                  Φόρτωση…
                </p>
              }
            >
              <ActivationContent />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}