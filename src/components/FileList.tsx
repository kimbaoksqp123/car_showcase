"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFiles, deleteFile } from '@/lib/redux/features/fileSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { FileData } from '@/lib/types';

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const FileItem = ({ file, onDelete }: { file: FileData; onDelete: (filename: string) => void }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-gray-900">{file.originalName}</h3>
        <div className="mt-1 flex flex-col sm:flex-row sm:divide-x sm:divide-gray-200">
          <div className="pr-3 text-sm text-gray-500">{formatFileSize(file.size)}</div>
          <div className="sm:pl-3 text-sm text-gray-500">{file.mimetype}</div>
          {file.uploadedAt && (
            <div className="sm:pl-3 text-sm text-gray-500">{formatDate(file.uploadedAt)}</div>
          )}
        </div>
      </div>
      <div className="mt-3 sm:mt-0 flex space-x-3">
        <a
          href={`http://localhost:3001/files/${file.filename}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
        >
          View
        </a>
        <button
          onClick={() => onDelete(file.filename)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const FileList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { files, isLoading, error } = useSelector((state: RootState) => state.files);
  
  useEffect(() => {
    dispatch(getAllFiles());
  }, [dispatch]);
  
  const handleDelete = (filename: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      dispatch(deleteFile(filename));
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>;
  }
  
  if (error) {
    return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">{error}</div>;
  }
  
  if (files.length === 0) {
    return <div className="text-center p-8 text-gray-500">No files uploaded yet.</div>;
  }
  
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Uploaded Files</h2>
      <div>
        {files.map((file) => (
          <FileItem key={file.filename} file={file} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default FileList; 