import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Calendar,
  FileText,
  Award,
  BarChart3,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import api from '../lib/api';

const CollegeDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollegeStats();
  }, []);

  const fetchCollegeStats = async () => {
    try {
      const response = await api.get('/dashboard/college');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching college stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'blue',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Active Courses',
      value: stats?.activeCourses || 0,
      icon: BookOpen,
      color: 'green',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Upcoming Exams',
      value: stats?.upcomingExams || 0,
      icon: Calendar,
      color: 'orange',
      change: '8 this month',
      trend: 'neutral'
    },
    {
      title: 'Avg Attendance',
      value: `${stats?.avgAttendance || 0}%`,
      icon: UserCheck,
      color: 'purple',
      change: '+3%',
      trend: 'up'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            College Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage students, courses, and academic operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-fade-in">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const bgColors: Record<string, string> = {
              blue: 'bg-blue-100 dark:bg-blue-900/30',
              green: 'bg-green-100 dark:bg-green-900/30',
              orange: 'bg-orange-100 dark:bg-orange-900/30',
              purple: 'bg-purple-100 dark:bg-purple-900/30'
            };
            const textColors: Record<string, string> = {
              blue: 'text-blue-600 dark:text-blue-400',
              green: 'text-green-600 dark:text-green-400',
              orange: 'text-orange-600 dark:text-orange-400',
              purple: 'text-purple-600 dark:text-purple-400'
            };

            return (
              <Card key={index} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className={`text-sm mt-2 ${
                        stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-gray-500'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-4 rounded-full ${bgColors[stat.color]}`}>
                      <Icon className={`w-8 h-8 ${textColors[stat.color]}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Department Performance */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Department Performance
                  </h2>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.departments?.map((dept: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{dept.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{dept.students} students</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{dept.avgGrade}</p>
                        <p className="text-sm text-gray-500">Avg Grade</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No department data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Exams */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Exams
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.upcomingExamsList?.slice(0, 5).map((exam: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{exam.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{exam.subject}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="info">{exam.date}</Badge>
                        <p className="text-sm text-gray-500 mt-1">{exam.students} students</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No upcoming exams
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4" />
                  Manage Students
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="w-4 h-4" />
                  Add Course
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4" />
                  Schedule Exam
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4" />
                  Generate Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Award className="w-4 h-4" />
                  View Achievements
                </Button>
              </CardContent>
            </Card>

            {/* Alerts & Notifications */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Alerts
                </h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats?.alerts?.map((alert: any, index: number) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'
                  }`}>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{alert.time}</p>
                  </div>
                )) || (
                  <div className="text-center py-4 text-gray-500">
                    No alerts
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Top Performers
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.topPerformers?.map((student: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{student.grade}</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-4 text-gray-500">
                      No data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboard;
