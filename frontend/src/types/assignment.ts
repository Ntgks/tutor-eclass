export interface Assignment {
    id: string;
    courseId: string;
    title: string;
    instructions: string | null;
    dueAt: string | null;
}

export interface CreateAssignmentRequest{
    title: string;
    instructions: string | null;
    dueAt: string | null;
}

export interface UpdateAssignmentRequest {
  title: string;
  instructions: string | null;
  dueAt: string | null;
}
