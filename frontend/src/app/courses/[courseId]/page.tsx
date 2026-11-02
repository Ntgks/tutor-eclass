import { Suspense } from "react";

import CourseDetails from "@/components/course-details";

interface CoursePageProps {
  params: Promise<{ courseId: string }>;
}

async function CourseContent({ params }: CoursePageProps) {
  const { courseId } = await params;

  return <CourseDetails key={courseId} courseId={courseId} />;
}

export default function CoursePage({ params }: CoursePageProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b-4 border-brand-500 bg-brand-900">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-6 sm:px-6 lg:px-8">
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
              Χώρος μαθήματος
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Suspense
          fallback={
            <p role="status" className="text-sm text-slate-500">
              Φόρτωση μαθήματος…
            </p>
          }
        >
          <CourseContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}