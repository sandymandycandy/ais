import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, Download, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BulkImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/admin/users/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setResult(response.data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = `name,email,password,role,college,course,year,phone
John Doe,john@example.com,,student,Sample College,Computer Science,2,
Jane Smith,jane@example.com,,student,Sample College,Electronics,3,`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-import-template.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bulk Import Users
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Import multiple users from a CSV file
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Instructions
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                CSV Format Requirements:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li><strong>Required fields:</strong> name, email</li>
                <li><strong>Optional fields:</strong> password, role, college, course, year, phone</li>
                <li>If password is not provided, a random password will be generated</li>
                <li>Default role is "student" if not specified</li>
                <li>College defaults to your organization if not specified</li>
              </ul>
            </div>

            <Button variant="outline" onClick={downloadTemplate} className="w-full">
              <Download className="w-4 h-4" />
              Download CSV Template
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upload CSV File
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {file ? file.name : 'Click to upload CSV file'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">CSV files only</p>
            </div>

            <Button
              onClick={handleImport}
              disabled={!file || loading}
              loading={loading}
              className="w-full"
            >
              <Users className="w-4 h-4" />
              Import Users
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Import Results
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {result.stats.total}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Rows</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {result.stats.success}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">Imported</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {result.stats.failed}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">Failed</p>
                </div>
              </div>

              {result.imported.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Successfully Imported ({result.imported.length})
                  </h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {result.imported.map((user: any, index: number) => (
                      <div
                        key={index}
                        className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                      >
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name} ({user.email})
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Temporary Password: <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">{user.tempPassword}</code>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    Errors ({result.errors.length})
                  </h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {result.errors.map((error: any, index: number) => (
                      <div
                        key={index}
                        className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                      >
                        <p className="text-sm font-medium text-red-900 dark:text-red-200">
                          Row {index + 1}: {error.row.name || error.row.email}
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400">{error.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BulkImport;
