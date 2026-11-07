import Link from "next/link";

import StudentManagement from "@/components/student-management";
import RequireRole from "@/components/require-role";
import LogoutButton from "@/components/logout-button";
import PendingReviews from "@/components/pending-reviews";

const navigation = [
  { href: "#overview", label: "Επισκόπηση", number: "01" },
  { href: "#reviews", label: "Για διόρθωση", number: "02" },
  { href: "#students", label: "Μαθητές", number: "03" },
];

export default function Home() {
  return (
    <RequireRole role="ROLE_TEACHER">
      <div className="min-h-screen bg-[#f5f7f9] text-foreground lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-lg bg-white p-3 text-brand-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Μετάβαση στο περιεχόμενο
        </a>

        <aside className="border-b border-brand-900/10 bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col px-5 py-5 lg:px-6 lg:py-8">
            <Link
              href="/"
              aria-label="Tutor eClass — Αρχική"
              className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-900 text-sm font-bold text-white"
              >
                TE
              </span>

              <span>
                <span className="block text-lg font-bold tracking-tight text-brand-900">
                  Tutor eClass
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  Χώρος καθηγήτριας
                </span>
              </span>
            </Link>

            <nav
              aria-label="Κύρια πλοήγηση"
              className="mt-6 lg:mt-12"
            >
              <p className="mb-3 hidden px-3 text-[11px] font-semibold tracking-widest text-slate-400 lg:block">
                Ο ΧΩΡΟΣ ΣΟΥ
              </p>

              <ul className="flex flex-wrap gap-2 lg:flex-col">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                    >
                      <span
                        aria-hidden="true"
                        className="hidden text-xs font-semibold text-brand-500 lg:inline"
                      >
                        {item.number}
                      </span>

                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-5 border-t border-slate-100 pt-4 lg:mt-auto lg:pt-6">
              <Link
                href="/account/password"
                className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-brand-600"
              >
                Ρυθμίσεις κωδικού
              </Link>

              <p className="mt-5 hidden px-3 text-xs leading-5 text-slate-400 lg:block">
                Ένας χώρος για κάθε μαθητή.
                <br />
                Ένα βήμα μπροστά σε κάθε μάθημα.
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-slate-200/70 bg-white/90">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8 lg:px-10">
              <div>
                <p className="text-sm font-semibold text-brand-900">
                  Ο πίνακάς σου
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Μαθητές, μαθήματα και εργασίες
                </p>
              </div>

              <div className="rounded-lg bg-white text-sm text-slate-700">
                <LogoutButton />
              </div>
            </div>
          </header>

          <main
            id="main-content"
            className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10 lg:py-10"
          >
            <section
              id="overview"
              aria-labelledby="overview-title"
              className="relative mb-8 scroll-mt-6 overflow-hidden rounded-3xl bg-brand-900 px-6 py-8 text-white sm:px-9 sm:py-10"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[40px] border-white/5"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 right-28 h-48 w-48 rounded-full bg-brand-500/15"
              />

              <div className="relative max-w-2xl">
                <p className="text-xs font-semibold tracking-widest text-brand-200">
                  TUTOR ECLASS
                </p>

                <h1
                  id="overview-title"
                  className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
                >
                  Κάθε μαθητής, ένα βήμα μπροστά.
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-brand-100">
                  Οργάνωσε τα μαθήματα, δες τις νέες υποβολές και
                  βοήθησε τους μαθητές σου να συνεχίσουν τη μελέτη τους.
                </p>

                <a
                  href="#students"
                  className="mt-6 inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Διαχείριση μαθητών
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </section>

            <div id="reviews" className="scroll-mt-6">
              <PendingReviews />
            </div>

            <div id="students" className="scroll-mt-6">
              <StudentManagement />
            </div>
          </main>
        </div>
      </div>
    </RequireRole>
  );
}