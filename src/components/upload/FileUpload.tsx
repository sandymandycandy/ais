import React, { useRef, useState } from 'react';
import { Upload, File, X, Loader2, CheckCircle } from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface FileUploadProps {
  onUploadSuccess: (url: string, fileName: string) => void;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  accept = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md',
  maxSizeMB = 10,
  multiple = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const { uploading, progress, error, uploadNoteFile, uploadMultipleFiles } = useFileUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const maxSize = maxSizeMB * 1024 * 1024;

    // Validate file sizes
    const oversizedFiles = fileArray.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed ${maxSizeMB}MB limit`);
      return;
    }

    setSelectedFiles(fileArray);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    if (multiple && selectedFiles.length > 1) {
      const results = await uploadMultipleFiles(selectedFiles);
      if (results) {
        const uploaded = selectedFiles.map((file, index) => ({
          name: file.name,
          url: results[index]?.url || ''
        }));
        setUploadedFiles(prev => [...prev, ...uploaded]);
        uploaded.forEach(file => onUploadSuccess(file.url, file.name));
        setSelectedFiles([]);
      }
    } else {
      const file = selectedFiles[0];
      const result = await uploadNoteFile(file);
      if (result) {
        const uploaded = { name: file.name, url: result.url };
        setUploadedFiles(prev => [...prev, uploaded]);
        onUploadSuccess(uploaded.url, uploaded.name);
        setSelectedFiles([]);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveSelected = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveUploaded = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      >
        <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Click to upload {multiple ? 'files' : 'file'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          {accept.split(',').map(ext => ext.toUpperCase()).join(', ')} up to {maxSizeMB}MB
        </p>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Selected Files
          </h4>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <File className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveSelected(index);
                }}
                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          ))}

          <Button
            onClick={handleUpload}
            loading={uploading}
            disabled={uploading}
            className="w-full"
          >
            <Upload className="w-4 h-4" />
            {uploading ? `Uploading... ${progress?.percentage || 0}%` : 'Upload Files'}
          </Button>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploaded Files
          </h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View file
                  </a>
                </div>
                <Badge variant="success">Uploaded</Badge>
              </div>
              <button
                onClick={() => handleRemoveUploaded(index)}
                className="p-1 hover:bg-green-100 dark:hover:bg-green-800 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
