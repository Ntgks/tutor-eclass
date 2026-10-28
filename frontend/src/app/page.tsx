import StudentManagement from "@/components/student-management";

import RequireRole from "@/components/require-role";

export default function Home(){
  return(
    <RequireRole role="ROLE_TEACHER">
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-indigo-600">
          Tutor eClass
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Διαχείριση μαθητών
        </h1>

        <p className="mt-3 text-slate-600">
          Ο προσωπικός χώρος οργάνωσης των ιδιαίτερων μαθημάτων.
        </p>

        <StudentManagement />
      </div>
    </main>
    </RequireRole>
  );
}