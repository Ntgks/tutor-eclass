export interface SubmissionFile {
  id: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentComment: string | null;
  submittedAt: string;
  feedback: string | null;
  reviewedAt: string | null;
  files: SubmissionFile[];
}

export interface CreateSubmissionRequest {
  studentComment: string | null;
}

export interface ReviewSubmissionRequest {
  feedback: string;
}