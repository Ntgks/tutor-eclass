export interface Course{
    id:string;
    studentId: string;
    title: string;
    description: string | null;
}

export interface CreateCourseRequest{
    title: string;
    description: string | null;
}