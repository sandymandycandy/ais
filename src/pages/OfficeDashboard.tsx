import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import {
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  Award,
  FileText,
  BarChart3,
} from 'lucide-react';
import api from '../lib/api';

const OfficeDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfficeStats();
  }, []);

  const fetchOfficeStats = async () => {
    try {
      const response = await api.get('/dashboard/office');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching office stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
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
      title: 'Active Opportunities',
      value: stats?.activeOpportunities || 0,
      icon: Briefcase,
      color: 'purple',
      change: '+8 this week',
      trend: 'up'
    },
    {
      title: 'Partner Companies',
      value: stats?.partnerCompanies || 0,
      icon: Building2,
      color: 'blue',
      change: '+3 new',
      trend: 'up'
    },
    {
      title: 'Applications',
      value: stats?.totalApplications || 0,
      icon: FileText,
      color: 'green',
      change: '+25%',
      trend: 'up'
    },
    {
      title: 'Placements',
      value: stats?.placements || 0,
      icon: CheckCircle,
      color: 'orange',
      change: `${stats?.placementRate || 0}% rate`,
      trend: 'neutral'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Placement Office Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage opportunities, companies, and student placements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-fade-in">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const bgColors: Record<string, string> = {
              purple: 'bg-purple-100 dark:bg-purple-900/30',
              blue: 'bg-blue-100 dark:bg-blue-900/30',
              green: 'bg-green-100 dark:bg-green-900/30',
              orange: 'bg-orange-100 dark:bg-orange-900/30'
            };
            const textColors: Record<string, string> = {
              purple: 'text-purple-600 dark:text-purple-400',
              blue: 'text-blue-600 dark:text-blue-400',
              green: 'text-green-600 dark:text-green-400',
              orange: 'text-orange-600 dark:text-orange-400'
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
          {/* Left Column - Active Opportunities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Opportunities */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Active Opportunities
                  </h2>
                  <Link to="/opportunities">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentOpportunities?.map((opp: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{opp.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{opp.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={opp.type === 'Job' ? 'success' : 'info'}>
                          {opp.type}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">{opp.applicants} applicants</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No active opportunities
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Partners */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Partner Companies
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {stats?.partnerCompaniesList?.map((company: any, index: number) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{company.name}</p>
                      <p className="text-xs text-gray-500">{company.openings} openings</p>
                    </div>
                  )) || (
                    <div className="col-span-3 text-center py-8 text-gray-500">
                      No partner companies
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Placement Statistics */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Placement Statistics
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Placement Rate</span>
                    <span className="text-2xl font-bold text-green-600">{stats?.placementRate || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats?.placementRate || 0}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.avgPackage || '0L'}</p>
                      <p className="text-sm text-gray-500">Avg Package</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.highestPackage || '0L'}</p>
                      <p className="text-sm text-gray-500">Highest Package</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.companies || 0}</p>
                      <p className="text-sm text-gray-500">Companies Visited</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Updates */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/opportunities/new">
                  <Button className="w-full justify-start" variant="outline">
                    <Briefcase className="w-4 h-4" />
                    Post Opportunity
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline">
                  <Building2 className="w-4 h-4" />
                  Add Company
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4" />
                  View Applications
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4" />
                  Schedule Interview
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4" />
                  Generate Reports
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Drives */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Drives
                </h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats?.upcomingDrives?.map((drive: any, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">{drive.company}</p>
                      <Badge variant="info">{drive.date}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{drive.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{drive.eligible} eligible students</p>
                  </div>
                )) || (
                  <div className="text-center py-4 text-gray-500">
                    No upcoming drives
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Placements */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recent Placements
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.recentPlacements?.map((placement: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {placement.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{placement.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{placement.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{placement.package}</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-4 text-gray-500">
                      No recent placements
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pending Reviews */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Pending Reviews
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Applications to review</span>
                    <Badge variant="warning">{stats?.pendingApplications || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Interviews to schedule</span>
                    <Badge variant="warning">{stats?.pendingInterviews || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeDashboard;
