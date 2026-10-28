import { Suspense } from "react";

import ActivationContent from "@/components/activation-content";

export default function ActivatePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold text-indigo-600">
          Tutor eClass
        </p>

        <h1 className="mt-2 text-2xl font-bold">
          Ενεργοποίηση λογαριασμού
        </h1>

        <p className="mb-6 mt-3 text-slate-600">
          Όρισε τον προσωπικό σου κωδικό.
        </p>

        <Suspense fallback={<p role="status">Φόρτωση…</p>}>
          <ActivationContent />
        </Suspense>
      </div>
    </main>
  );
}