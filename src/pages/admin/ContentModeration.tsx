import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, FileText, BookOpen, Briefcase, Eye, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ContentModeration: React.FC = () => {
  const [content, setContent] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contentType, setContentType] = useState('note');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [actionNote, setActionNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchContent();
  }, [contentType]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/moderation/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/moderation/pending`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { type: contentType }
      });
      setContent(response.data.content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/admin/moderation/${contentType}/${id}/approve`,
        { note: actionNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedItem(null);
      setActionNote('');
      fetchContent();
      fetchStats();
      setActionLoading(false);
    } catch (error) {
      console.error('Error approving content:', error);
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!actionNote) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/admin/moderation/${contentType}/${id}/reject`,
        { reason: actionNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedItem(null);
      setActionNote('');
      fetchContent();
      fetchStats();
      setActionLoading(false);
    } catch (error) {
      console.error('Error rejecting content:', error);
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Content Moderation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and approve user-submitted content
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Notes</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.notes?.pending || 0}
                    </p>
                  </div>
                  <FileText className="w-12 h-12 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Exams</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.exams?.pending || 0}
                    </p>
                  </div>
                  <BookOpen className="w-12 h-12 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Pending</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalPending || 0}
                    </p>
                  </div>
                  <Clock className="w-12 h-12 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Type Filter */}
        <div className="mb-6">
          <div className="flex gap-2">
            <Button
              variant={contentType === 'note' ? 'primary' : 'outline'}
              onClick={() => setContentType('note')}
            >
              <FileText className="w-4 h-4" />
              Notes
            </Button>
            <Button
              variant={contentType === 'exam' ? 'primary' : 'outline'}
              onClick={() => setContentType('exam')}
            >
              <BookOpen className="w-4 h-4" />
              Exams
            </Button>
            <Button
              variant={contentType === 'opportunity' ? 'primary' : 'outline'}
              onClick={() => setContentType('opportunity')}
            >
              <Briefcase className="w-4 h-4" />
              Opportunities
            </Button>
          </div>
        </div>

        {/* Content List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : content.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No pending {contentType}s for review
              </p>
            </div>
          ) : (
            content.map(item => (
              <Card key={item._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    {item.uploadedBy?.profilePicture ? (
                      <img
                        src={item.uploadedBy.profilePicture}
                        alt={item.uploadedBy.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.uploadedBy?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedItem(item)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Review Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Review {contentType}
                </h2>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {selectedItem.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {selectedItem.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes / Reason
                  </label>
                  <textarea
                    value={actionNote}
                    onChange={e => setActionNote(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Add notes or reason for rejection..."
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedItem(null);
                      setActionNote('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedItem._id)}
                    loading={actionLoading}
                    className="flex-1 text-red-600"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedItem._id)}
                    loading={actionLoading}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentModeration;
