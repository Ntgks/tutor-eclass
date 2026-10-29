export interface Material {
  id: string;
  courseId: string;
  title: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
}

export interface CreateMaterialRequest {
  title: string;
}