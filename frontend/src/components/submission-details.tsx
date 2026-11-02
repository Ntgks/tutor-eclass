import type { Submission } from "@/types/submission";

interface SubmissionDetailsProps {
  submission: Submission;
  courseId: string;
}

export default function SubmissionDetails({
  submission,
  courseId,
}: SubmissionDetailsProps) {
  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50/40">
      <div className="border-b border-brand-200/60 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-brand-900">
            Η εργασία έχει υποβληθεί
          </p>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
              submission.reviewedAt
                ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                : "bg-amber-50 text-amber-800 ring-amber-200"
            }`}
          >
            {submission.reviewedAt
              ? "Ελέγχθηκε"
              : "Αναμονή διόρθωσης"}
          </span>
        </div>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Υποβολή (ώρα Ελλάδας):{" "}
          {new Date(submission.submittedAt).toLocaleString("el-GR", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Europe/Athens",
          })}
        </p>
      </div>

      <div className="space-y-5 p-4">
        {submission.studentComment && (
          <div>
            <h4 className="text-sm font-semibold text-brand-900">
              Σχόλιο μαθητή
            </h4>

            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
              {submission.studentComment}
            </p>
          </div>
        )}

        <div>
          <h4 className="mb-3 text-sm font-semibold text-brand-900">
            Συνημμένα
          </h4>

          <ul className="space-y-2">
            {submission.files.map((file) => (
              <li
                key={file.id}
                className="rounded-lg border border-brand-900/10 bg-white p-3"
              >
                <p className="break-all text-sm font-medium text-slate-700">
                  {file.originalFilename}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {Math.ceil(file.sizeBytes / 1024)} KB
                </p>

                <a
                  href={`/api/courses/${encodeURIComponent(courseId)}/assignments/${encodeURIComponent(submission.assignmentId)}/submissions/files/${encodeURIComponent(file.id)}/download`}
                  className="mt-3 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <span aria-hidden="true">↓</span>
                  Λήψη συνημμένου
                </a>
              </li>
            ))}
          </ul>
        </div>

        {submission.reviewedAt ? (
          <div className="rounded-lg border border-emerald-200 bg-white p-4">
            <h4 className="text-sm font-semibold text-brand-900">
              Διόρθωση καθηγήτριας
            </h4>

            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
              {submission.feedback || "Η εργασία ελέγχθηκε."}
            </p>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Διόρθωση (ώρα Ελλάδας):{" "}
              {new Date(submission.reviewedAt).toLocaleString("el-GR", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "Europe/Athens",
              })}
            </p>
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-500">
            Αναμονή διόρθωσης από την καθηγήτρια.
          </p>
        )}
      </div>
    </div>
  );
}