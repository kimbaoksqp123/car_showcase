"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { getAllFiles } from '@/lib/redux/features/fileSlice';
import FileUploader from '@/components/FileUploader';
import FileList from '@/components/FileList';

export default function UploadFilesPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { uploadedFiles } = useSelector((state: RootState) => state.files);
  
  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated || !user?.isAdmin) {
      router.push('/signin');
    }
  }, [isAuthenticated, user, router]);
  
  // If not authenticated or not admin, don't render the page
  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }
  
  return (
    <main className="relative bg-gray-50 min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            File Management
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Upload, view, and manage your files
          </p>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Files</h2>
            <FileUploader />
            
            {uploadedFiles.length > 0 && (
              <div className="mt-8 bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Files uploaded successfully! {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} uploaded.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          {/* <FileList /> */}
        </div>
      </div>
    </main>
  );
} 