export interface Course{
    id:string;
    studentId: string;
    title: string;
    description: string | null;
    archived: boolean;
}

export interface CreateCourseRequest{
    title: string;
    description: string | null;
}

export interface UpdateCourseRequest {
  title: string;
  description: string | null;
}