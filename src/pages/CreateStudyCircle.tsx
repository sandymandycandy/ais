import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Globe, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Input from '../components/ui/Input';
import api, { getErrorMessage } from '../lib/api';

interface FormData {
  name: string;
  description: string;
  subject: string;
  level: string;
  category: string;
  visibility: 'public' | 'private';
  maxMembers: number;
  studySchedule: string;
  meetingLink: string;
}

const CreateStudyCircle: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    subject: '',
    level: '',
    category: '',
    visibility: 'public',
    maxMembers: 50,
    studySchedule: '',
    meetingLink: '',
  });

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subjects = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Business',
    'Engineering',
    'Medical',
    'Other',
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const categories = [
    'Exam Preparation',
    'Skill Development',
    'Project Collaboration',
    'General Discussion',
    'Homework Help',
    'Research',
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'maxMembers' ? parseInt(value) || 1 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter a circle name');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!formData.subject) {
      setError('Please select a subject');
      return;
    }
    if (!formData.level) {
      setError('Please select a level');
      return;
    }
    if (formData.maxMembers < 2 || formData.maxMembers > 500) {
      setError('Max members must be between 2 and 500');
      return;
    }

    setCreating(true);

    try {
      const response: any = await api.post('/study-circles', formData);
      setSuccess(true);

      // Redirect to the new circle after 2 seconds
      setTimeout(() => {
        navigate(`/study-circles/${response.studyCircle._id}`);
      }, 2000);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/study-circles')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Study Circles
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Study Circle</h1>
        <p className="text-gray-600">Start a community to learn and grow together</p>
      </div>

      {/* Success Message */}
      {success && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Study circle created successfully!</p>
              <p className="text-sm text-green-600">Redirecting to your new circle...</p>
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

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Circle Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., JEE 2025 Preparation Group"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe what your study circle is about, goals, and what members can expect..."
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
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Level</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Circle Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Visibility</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, visibility: 'public' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.visibility === 'public'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Globe
                      className={`w-5 h-5 ${
                        formData.visibility === 'public' ? 'text-indigo-600' : 'text-gray-400'
                      }`}
                    />
                    <span className="font-semibold text-gray-900">Public</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    Anyone can find and join this circle
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, visibility: 'private' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.visibility === 'private'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Lock
                      className={`w-5 h-5 ${
                        formData.visibility === 'private' ? 'text-indigo-600' : 'text-gray-400'
                      }`}
                    />
                    <span className="font-semibold text-gray-900">Private</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    Only invited members can join
                  </p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Members
              </label>
              <Input
                type="number"
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleChange}
                min="2"
                max="500"
                placeholder="50"
              />
              <p className="text-sm text-gray-500 mt-1">
                Set the maximum number of members (2-500)
              </p>
            </div>
          </div>
        </Card>

        {/* Optional Details */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Optional Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Study Schedule
              </label>
              <Input
                type="text"
                name="studySchedule"
                value={formData.studySchedule}
                onChange={handleChange}
                placeholder="e.g., Mon-Fri 8 PM - 10 PM IST"
              />
              <p className="text-sm text-gray-500 mt-1">
                When does your group typically meet or study?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Link (Zoom, Google Meet, etc.)
              </label>
              <Input
                type="url"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                placeholder="https://zoom.us/j/..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Share your virtual meeting link with members
              </p>
            </div>
          </div>
        </Card>

        {/* Guidelines */}
        <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Study Circle Guidelines</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Keep discussions respectful and on-topic</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Share knowledge and help fellow members</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Maintain regular activity to keep the circle engaging</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>No spam, advertising, or inappropriate content</span>
            </li>
          </ul>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/study-circles')}
            disabled={creating}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={creating}>
            <Users className="w-4 h-4 mr-2" />
            {creating ? 'Creating...' : 'Create Study Circle'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateStudyCircle;
