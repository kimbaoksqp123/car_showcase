import axios from 'axios';
import { FileData, UploadResponse } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Files API
export const filesApi = {
  upload: async (files: File[]): Promise<UploadResponse> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getAll: async (): Promise<FileData[]> => {
    const response = await api.get('/files');
    return response.data.files;
  },
  
  delete: async (filename: string): Promise<{ message: string }> => {
    const response = await api.delete(`/files/${filename}`);
    return response.data;
  }
};

export default api; 