import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import api from '../lib/api';

interface FormData {
  title: string;
  subject: string;
  topic: string;
  course: string;
  semester: string;
  professor: string;
  description: string;
}

const UploadNotes: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    subject: '',
    topic: '',
    course: '',
    semester: '',
    professor: '',
    description: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg',
  ];

  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload PDF, PPT, DOCX, or images (JPG, PNG).';
    }
    if (file.size > maxFileSize) {
      return 'File size exceeds 50MB limit.';
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSelectedFile(file);
    setError(null);
    // Auto-fill title from filename if empty
    if (!formData.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      setFormData({ ...formData, title: fileName });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('presentation') || type.includes('powerpoint')) return '📊';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    if (!formData.title || !formData.subject || !formData.topic) {
      setError('Please fill in all required fields (Title, Subject, Topic)');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData for multipart upload
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);
      uploadData.append('title', formData.title);
      uploadData.append('subject', formData.subject);
      uploadData.append('topic', formData.topic);
      uploadData.append('course', formData.course);
      uploadData.append('semester', formData.semester);
      uploadData.append('professor', formData.professor);
      uploadData.append('description', formData.description);

      // Upload with progress tracking
      const response = await api.post('/notes', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });

      setSuccess(true);
      setUploading(false);

      // Redirect to note detail page after 2 seconds
      setTimeout(() => {
        navigate(`/notes/${response.data.note._id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload note. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Study Notes</h1>
        <p className="text-gray-600">Share your notes with the community and earn coins!</p>
      </div>

      {/* Success Message */}
      {success && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Note uploaded successfully!</p>
              <p className="text-sm text-green-600">Redirecting to note details...</p>
            </div>
          </div>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload File</h2>

          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag and drop your file here
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
                accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-gray-500 mt-4">
                Supported: PDF, PPT, DOCX, JPG, PNG (Max 50MB)
              </p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{getFileIcon(selectedFile.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(selectedFile.size)} • {selectedFile.type.split('/')[1].toUpperCase()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {uploading && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Uploading...</span>
                        <span className="font-medium text-indigo-600">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Note Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Note Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Data Structures - Chapter 5: Trees"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="Business">Business</option>
                  <option value="Economics">Economics</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g., Binary Trees"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <Input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g., B.Tech CSE"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professor</label>
              <Input
                type="text"
                name="professor"
                value={formData.professor}
                onChange={handleChange}
                placeholder="e.g., Dr. Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Brief description of what these notes cover..."
              />
            </div>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/notes')}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={uploading || !selectedFile}>
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Note
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadNotes;
