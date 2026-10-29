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
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 text-sm font-semibold text-indigo-600">
          Tutor eClass
        </p>

        <Suspense fallback={<p role="status">Φόρτωση…</p>}>
          <CourseContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}