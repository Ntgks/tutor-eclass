import StudentManagement from "@/components/student-management";
import RequireRole from "@/components/require-role";
import LogoutButton from "@/components/logout-button";

export default function Home() {
  return (
    <RequireRole role="ROLE_TEACHER">
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
            <div>
              <p className="text-lg font-bold tracking-tight">
                Tutor <span className="text-indigo-600">eClass</span>
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Χώρος καθηγήτριας
              </p>
            </div>

            <LogoutButton />
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Διαχείριση μαθητών
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Οργάνωσε τους μαθητές, τα μαθήματα και τις εργασίες σου
              σε έναν χώρο.
            </p>
          </div>

          <StudentManagement />
        </div>
      </main>
    </RequireRole>
  );
}