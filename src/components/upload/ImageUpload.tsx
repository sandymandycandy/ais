import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';
import Button from '../ui/Button';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImage?: string;
  uploadType?: 'avatar' | 'project-image';
  maxSizeMB?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  currentImage,
  uploadType = 'avatar',
  maxSizeMB = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const { uploading, progress, error, uploadFile } = useFileUpload();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    const result = await uploadFile(file, uploadType);
    if (result) {
      onUploadSuccess(result.url);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className={`w-full object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700 ${
              uploadType === 'avatar' ? 'h-48' : 'h-64'
            }`}
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {uploading && progress && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">{progress.percentage}%</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors ${
            uploadType === 'avatar' ? 'h-48' : 'h-64'
          } flex flex-col items-center justify-center`}
        >
          <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Click to upload image
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            PNG, JPG, GIF up to {maxSizeMB}MB
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!preview && (
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="w-full"
          disabled={uploading}
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Choose Image'}
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
