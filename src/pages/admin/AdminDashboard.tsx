import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Users,
  FileText,
  BookOpen,
  Briefcase,
  TrendingUp,
  Activity,
  UserPlus,
  BarChart3,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { formatNumber } from '../../lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface DashboardAnalytics {
  overview: {
    totalUsers: number;
    totalNotes: number;
    totalExams: number;
    totalOpportunities: number;
    newUsers: number;
    activeUsers: number;
  };
  notesBySubject: Array<{ _id: string; count: number }>;
  userGrowth: Array<{
    _id: { year: number; month: number };
    count: number;
  }>;
  topContributors: Array<{
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    count: number;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: analytics?.overview.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Notes',
      value: analytics?.overview.totalNotes || 0,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Total Exams',
      value: analytics?.overview.totalExams || 0,
      icon: BookOpen,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Opportunities',
      value: analytics?.overview.totalOpportunities || 0,
      icon: Briefcase,
      color: 'bg-orange-500',
      change: '+5%'
    },
    {
      title: 'New Users (30d)',
      value: analytics?.overview.newUsers || 0,
      icon: UserPlus,
      color: 'bg-pink-500',
      change: '+23%'
    },
    {
      title: 'Active Users (7d)',
      value: analytics?.overview.activeUsers || 0,
      icon: Activity,
      color: 'bg-indigo-500',
      change: '+18%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your platform's performance and statistics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(stat.value)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notes by Subject */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Subjects
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.notesBySubject.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {subject._id}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {subject.count} notes
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (subject.count /
                                Math.max(...analytics.notesBySubject.map(s => s.count))) *
                              100
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Contributors
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topContributors.map((contributor, index) => (
                  <div
                    key={contributor._id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      {contributor.profilePicture ? (
                        <img
                          src={contributor.profilePicture}
                          alt={contributor.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {contributor.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {contributor.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {contributor.count}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">uploads</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Growth Chart */}
        <Card className="mt-8">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              User Growth (Last 6 Months)
            </h3>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-around gap-2">
              {analytics?.userGrowth.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                    style={{
                      height: `${
                        (month.count / Math.max(...analytics.userGrowth.map(m => m.count))) *
                        100
                      }%`,
                      minHeight: '20px'
                    }}
                  />
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {month.count}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-US', {
                        month: 'short'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
