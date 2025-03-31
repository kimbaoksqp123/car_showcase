export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

export interface FileData {
  id?: number;
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  uploadedAt?: string;
}

export interface UploadResponse {
  message: string;
  files: FileData[];
} 