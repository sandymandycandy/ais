import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import {
  TrendingUp,
  Award,
  BookOpen,
  Target,
  Calendar,
  Clock,
  CheckCircle,
  Users,
  Briefcase,
  FileText,
} from 'lucide-react';
import { formatRelativeTime, calculateDaysUntil } from '../lib/utils';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response: any = await api.get('/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8 animate-fade-in">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-fade-in">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton variant="circular" width={48} height={48} />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Here's what's happening with your studies today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-fade-in">
          <Card hover className="hover-lift group">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {user?.level || 1}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card hover className="hover-lift group">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">XP Points</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {user?.xp || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card hover className="hover-lift group">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Coins</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {user?.coins || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card hover className="hover-lift group">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Study Streak</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  7 days
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-full group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Tasks */}
            <Card hover className="hover-lift">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span>Today's Tasks</span>
                  </h2>
                  <Button size="sm" variant="outline">Add Task</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { task: 'Complete Data Structures assignment', priority: 'high', time: '2:00 PM' },
                    { task: 'Take mock test for JEE Advanced', priority: 'medium', time: '4:00 PM' },
                    { task: 'Review yesterday\'s notes', priority: 'low', time: '7:00 PM' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                        <div>
                          <p className="font-medium text-gray-900">{item.task}</p>
                          <p className="text-sm text-gray-500 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.time}</span>
                          </p>
                        </div>
                      </div>
                      <Badge variant={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'default'}>
                        {item.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Test Performance */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span>Recent Mock Tests</span>
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { test: 'JEE Main Physics', score: 85, date: '2 days ago', improvement: '+5%' },
                    { test: 'Mathematics Chapter Test', score: 92, date: '5 days ago', improvement: '+8%' },
                    { test: 'Chemistry Mock Test', score: 78, date: '1 week ago', improvement: '-3%' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.test}</p>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{item.score}%</p>
                        <p className={`text-sm ${item.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {item.improvement}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Tests
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Upcoming Deadlines</span>
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: 'JEE Main Application', days: 5, type: 'Exam' },
                    { title: 'Google Summer Internship', days: 12, type: 'Opportunity' },
                    { title: 'Project Submission', days: 15, type: 'Assignment' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                        <Badge variant="info">{item.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">{item.days} days remaining</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/notes/upload">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Upload Notes
                  </Button>
                </Link>
                <Link to="/exams/mock-tests">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Take Mock Test
                  </Button>
                </Link>
                <Link to="/opportunities">
                  <Button variant="outline" className="w-full justify-start">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse Opportunities
                  </Button>
                </Link>
                <Link to="/study-circles">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Join Study Circle
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold text-gray-900">Syllabus Progress</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { subject: 'Physics', progress: 75 },
                    { subject: 'Chemistry', progress: 60 },
                    { subject: 'Mathematics', progress: 85 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{item.subject}</span>
                        <span className="text-gray-600">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
