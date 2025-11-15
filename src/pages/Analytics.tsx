import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Clock,
  Trophy,
  Zap,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';
import api, { getErrorMessage } from '../lib/api';

interface AnalyticsData {
  weeklyActivity: {
    day: string;
    hours: number;
  }[];
  recentAchievements: {
    _id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
  }[];
  performanceMetrics: {
    testScores: {
      average: number;
      total: number;
      improvement: number;
    };
    studyGoals: {
      completed: number;
      total: number;
      percentage: number;
    };
    contributions: {
      notes: number;
      projects: number;
      discussions: number;
    };
  };
}

const Analytics: React.FC = () => {
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/analytics');
      setAnalytics(response.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const weeklyActivity = analytics?.weeklyActivity || [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.1 },
    { day: 'Fri', hours: 2.9 },
    { day: 'Sat', hours: 5.3 },
    { day: 'Sun', hours: 4.7 },
  ];

  const maxHours = Math.max(...weeklyActivity.map(d => d.hours));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your progress and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-100 rounded-lg p-3">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{user?.gamification?.xp || 0}</p>
              <p className="text-sm text-gray-600">Total XP</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${((user?.gamification?.xp || 0) % 1000) / 10}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{1000 - ((user?.gamification?.xp || 0) % 1000)} XP to next level</p>
        </Card>

        <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 rounded-lg p-3">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{user?.gamification?.streak?.current || 0}</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Longest: {user?.gamification?.streak?.longest || 0} days
          </p>
        </Card>

        <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 rounded-lg p-3">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Level {user?.gamification?.level || 1}</p>
              <p className="text-sm text-gray-600">Current Level</p>
            </div>
          </div>
          <Badge variant="primary" className="mt-3">
            {user?.gamification?.badges?.length || 0} Badges
          </Badge>
        </Card>

        <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-lg p-3">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.performanceMetrics?.contributions?.notes || 0}
              </p>
              <p className="text-sm text-gray-600">Notes Shared</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            +{analytics?.performanceMetrics?.contributions?.projects || 0} projects
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Activity Chart */}
        <Card className="lg:col-span-2 p-6 animate-slide-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Weekly Activity</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-end justify-between h-64 gap-4">
            {weeklyActivity.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-48">
                  <div
                    className="bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:from-indigo-700 hover:to-indigo-500 relative group"
                    style={{ height: `${(data.hours / maxHours) * 100}%` }}
                  >
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {data.hours}h
                    </span>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">{data.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total this week</span>
              <span className="font-semibold text-gray-900">
                {weeklyActivity.reduce((sum, d) => sum + d.hours, 0).toFixed(1)} hours
              </span>
            </div>
          </div>
        </Card>

        {/* Recent Achievements */}
        <Card className="p-6 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Achievements</h2>
            <Award className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {user?.gamification?.achievements && user.gamification.achievements.length > 0 ? (
              user.gamification.achievements.slice(0, 5).map((achievement: any, index: number) => (
                <div key={index} className="flex items-start gap-3 animate-fade-in">
                  <div className="bg-yellow-100 rounded-lg p-2 flex-shrink-0">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{achievement.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{achievement.description}</p>
                    {achievement.earnedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No achievements yet</p>
                <p className="text-xs text-gray-400 mt-1">Keep learning to unlock badges!</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 animate-slide-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Test Performance</h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Average Score</span>
                <span className="text-lg font-bold text-blue-600">
                  {analytics?.performanceMetrics?.testScores?.average || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${analytics?.performanceMetrics?.testScores?.average || 0}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm pt-3 border-t">
              <span className="text-gray-600">Total Tests</span>
              <span className="font-medium text-gray-900">
                {analytics?.performanceMetrics?.testScores?.total || 0}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Improvement</span>
              <span className="font-medium text-green-600">
                +{analytics?.performanceMetrics?.testScores?.improvement || 0}%
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 rounded-lg p-3">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Study Goals</h3>
          </div>

          <div className="text-center mb-4">
            <p className="text-4xl font-bold text-green-600">
              {analytics?.performanceMetrics?.studyGoals?.percentage || 0}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-green-600 h-3 rounded-full transition-all"
              style={{ width: `${analytics?.performanceMetrics?.studyGoals?.percentage || 0}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completed</span>
            <span className="font-medium text-gray-900">
              {analytics?.performanceMetrics?.studyGoals?.completed || 0} / {analytics?.performanceMetrics?.studyGoals?.total || 0}
            </span>
          </div>
        </Card>

        <Card className="p-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Contributions</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Notes Shared</span>
              <span className="font-bold text-gray-900">
                {analytics?.performanceMetrics?.contributions?.notes || 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Projects</span>
              <span className="font-bold text-gray-900">
                {analytics?.performanceMetrics?.contributions?.projects || 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Discussions</span>
              <span className="font-bold text-gray-900">
                {analytics?.performanceMetrics?.contributions?.discussions || 0}
              </span>
            </div>

            <div className="pt-3 border-t">
              <Badge variant="primary" className="w-full justify-center">
                Total: {(analytics?.performanceMetrics?.contributions?.notes || 0) +
                        (analytics?.performanceMetrics?.contributions?.projects || 0) +
                        (analytics?.performanceMetrics?.contributions?.discussions || 0)} contributions
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
