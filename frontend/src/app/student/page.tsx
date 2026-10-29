import RequireRole from "@/components/require-role";

import LogoutButton from "@/components/logout-button";

import MyCourseList from "@/components/my-course-list";

export default function StudentPage() {
  return (
    <RequireRole role="ROLE_STUDENT">
        <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
            <div className="mx-auto max-w-5xl">
              <div className="mb-6 flex justify-end">
                <LogoutButton />
              </div>
              <p className="text-sm font-semibold text-indigo-600">
                Tutor eClass
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Ο χώρος μου
              </h1>

              <p className="mt-3 text-slate-600">
                Εδώ θα βρίσκεις τα προσωπικά σου μαθήματα και τις εργασίες σου.
              </p>

              <section className="mt-8" aria-label="Τα μαθήματά μου">
                <MyCourseList />
              </section>
            </div>
        </main>
    </RequireRole>
  );
}