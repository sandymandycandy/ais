import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  url: string;
  publicId?: string;
  format?: string;
  size?: number;
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    endpoint: 'avatar' | 'note' | 'project-image' | 'multiple'
  ): Promise<UploadResult | null> => {
    try {
      setUploading(true);
      setError(null);
      setProgress({ loaded: 0, total: file.size, percentage: 0 });

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');

      const response = await axios.post(`${API_URL}/api/upload/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: percentCompleted
            });
          }
        }
      });

      setUploading(false);
      return response.data;
    } catch (err: any) {
      setUploading(false);
      setError(err.response?.data?.message || 'Upload failed');
      return null;
    }
  };

  const uploadMultipleFiles = async (files: File[]): Promise<UploadResult[] | null> => {
    try {
      setUploading(true);
      setError(null);

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      setProgress({ loaded: 0, total: totalSize, percentage: 0 });

      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const token = localStorage.getItem('token');

      const response = await axios.post(`${API_URL}/api/upload/multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: percentCompleted
            });
          }
        }
      });

      setUploading(false);
      return response.data.files;
    } catch (err: any) {
      setUploading(false);
      setError(err.response?.data?.message || 'Upload failed');
      return null;
    }
  };

  const uploadAvatar = async (file: File): Promise<UploadResult | null> => {
    return uploadFile(file, 'avatar');
  };

  const uploadNoteFile = async (file: File): Promise<UploadResult | null> => {
    return uploadFile(file, 'note');
  };

  const uploadProjectImage = async (file: File): Promise<UploadResult | null> => {
    return uploadFile(file, 'project-image');
  };

  const reset = () => {
    setUploading(false);
    setProgress(null);
    setError(null);
  };

  return {
    uploading,
    progress,
    error,
    uploadFile,
    uploadMultipleFiles,
    uploadAvatar,
    uploadNoteFile,
    uploadProjectImage,
    reset
  };
};
