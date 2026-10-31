export type StudentStatus = "INVITED" | "ACTIVE" | "DISABLED";

export interface Student {
  id: string;
  fullName: string;
  email: string;
  status: StudentStatus;
  educationLevel: string | null;
}

export interface CreateStudentRequest{
    fullName: string;
    email: string;
    educationLevel: string | null;
}

export interface UpdateStudentRequest {
  fullName: string;
  email: string;
  educationLevel: string | null;
}