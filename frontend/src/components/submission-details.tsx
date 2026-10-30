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
    <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-green-700">
        Η εργασία έχει υποβληθεί.
      </p>

      <p className="text-sm text-slate-600">
        Υποβολή (ώρα Ελλάδας):{" "}
        {new Date(submission.submittedAt).toLocaleString("el-GR", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Europe/Athens",
        })}
      </p>

      {submission.studentComment && (
        <div>
          <h4 className="text-sm font-semibold">Σχόλιο μαθητή</h4>

          <p className="mt-1 whitespace-pre-wrap text-sm">
            {submission.studentComment}
          </p>
        </div>
      )}

      <div>
        <h4 className="mb-2 text-sm font-semibold">Συνημμένα</h4>

        <ul className="space-y-2">
          {submission.files.map((file) => (
            <li key={file.id} className="text-sm">
              <span className="break-all">{file.originalFilename}</span>
              {" — "}
              {Math.ceil(file.sizeBytes / 1024)} KB
              <a 
                href={`/api/courses/${encodeURIComponent(courseId)}/assignments/${encodeURIComponent(submission.assignmentId)}/submissions/files/${encodeURIComponent(file.id)}/download`}
                className="mt-1 block font-semibold text-indigo-700 hover:underline"
              >
                Λήψη συνημμένου
              </a>
            </li>
          ))}
        </ul>
      </div>

      {submission.reviewedAt ? (
        <div>
          <h4 className="text-sm font-semibold">Διόρθωση καθηγήτριας</h4>

          <p className="mt-1 whitespace-pre-wrap text-sm">
            {submission.feedback || "Η εργασία ελέγχθηκε."}
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-600">
          Αναμονή διόρθωσης από την καθηγήτρια.
        </p>
      )}
    </div>
  );
}