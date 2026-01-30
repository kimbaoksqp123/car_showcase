import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { filesApi } from '@/lib/api';
import { FileData, UploadResponse } from '@/lib/types';

interface FilesState {
  files: FileData[];
  uploadedFiles: FileData[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FilesState = {
  files: [],
  uploadedFiles: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const uploadFiles = createAsyncThunk(
  'files/upload',
  async (files: File[], { rejectWithValue }) => {
    try {
      const response = await filesApi.upload(files);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload files');
    }
  }
);

export const getAllFiles = createAsyncThunk(
  'files/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const files = await filesApi.getAll();
      return files;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch files');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/delete',
  async (filename: string, { rejectWithValue }) => {
    try {
      const response = await filesApi.delete(filename);
      return { filename, message: response.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete file');
    }
  }
);

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    clearUploadedFiles: (state) => {
      state.uploadedFiles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload files
      .addCase(uploadFiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadFiles.fulfilled, (state, action: PayloadAction<UploadResponse>) => {
        state.isLoading = false;
        state.uploadedFiles = action.payload.files;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get all files
      .addCase(getAllFiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllFiles.fulfilled, (state, action: PayloadAction<FileData[]>) => {
        state.isLoading = false;
        state.files = action.payload;
      })
      .addCase(getAllFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete file
      .addCase(deleteFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action: PayloadAction<{ filename: string; message: string }>) => {
        state.isLoading = false;
        state.files = state.files.filter(file => file.filename !== action.payload.filename);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUploadedFiles } = fileSlice.actions;
export default fileSlice.reducer; 