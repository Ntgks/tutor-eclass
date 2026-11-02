import LoginForm from "@/components/login-form";

export default function LoginPage() {
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
              ΚΑΘΕ ΜΑΘΗΜΑ, ΕΝΑ ΒΗΜΑ ΜΠΡΟΣΤΑ
            </p>

            <h2 className="mt-4 max-w-sm text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Περισσότερος χώρος για μάθηση.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-brand-100">
              Μαθήματα, σημειώσεις και εργασίες σε έναν προσωπικό
              χώρο που συνδέει την καθηγήτρια με τους μαθητές της.
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

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand-900">
              Σύνδεση
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Συνδέσου με το email και τον κωδικό σου για να
              συνεχίσεις στον χώρο σου.
            </p>

            <LoginForm />

            <p className="mt-7 border-t border-slate-100 pt-5 text-xs leading-6 text-slate-500">
              Αν είσαι νέος μαθητής, ενεργοποίησε πρώτα τον
              λογαριασμό σου από τον σύνδεσμο πρόσκλησης της
              καθηγήτριάς σου.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}