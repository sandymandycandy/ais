import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  BookOpen,
  MessageCircle,
  TrendingUp,
  Clock,
  Globe,
  Lock,
  Filter,
  Star,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import api, { getErrorMessage } from '../lib/api';

interface StudyCircle {
  _id: string;
  name: string;
  description: string;
  subject: string;
  level: string;
  category: string;
  visibility: 'public' | 'private';
  members: any[];
  maxMembers: number;
  creator: {
    _id: string;
    fullName: string;
  };
  posts: any[];
  createdAt: string;
  isActive: boolean;
}

const StudyCircles: React.FC = () => {
  const navigate = useNavigate();

  const [circles, setCircles] = useState<StudyCircle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchStudyCircles();
  }, [selectedSubject, selectedLevel]);

  const fetchStudyCircles = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedSubject) params.append('subject', selectedSubject);
      if (selectedLevel) params.append('level', selectedLevel);

      const response = await api.get(`/study-circles?${params.toString()}`);
      setCircles(response.data.studyCircles || []);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCircle = async (circleId: string) => {
    try {
      await api.post(`/study-circles/${circleId}/join`);
      // Refresh circles to update member count
      fetchStudyCircles();
    } catch (err: any) {
      alert(getErrorMessage(err));
    }
  };

  const filteredCircles = circles.filter((circle) =>
    circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    circle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    circle.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const subjects = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Business', 'Engineering'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const getAvailabilityColor = (circle: StudyCircle) => {
    const availableSpots = circle.maxMembers - circle.members.length;
    if (availableSpots === 0) return 'text-red-600';
    if (availableSpots <= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Circles</h1>
          <p className="text-gray-600">Join or create study groups to learn together</p>
        </div>
        <Button onClick={() => navigate('/study-circles/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Circle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 rounded-lg p-3">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{circles.length}</p>
              <p className="text-sm text-gray-600">Active Circles</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-lg p-3">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
              <p className="text-sm text-gray-600">Subjects</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 rounded-lg p-3">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {circles.reduce((sum, c) => sum + c.posts.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Posts</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {circles.reduce((sum, c) => sum + c.members.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Members</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search study circles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Levels</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* Study Circles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchStudyCircles}>Try Again</Button>
        </Card>
      ) : filteredCircles.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Study Circles Found"
          description={
            searchQuery || selectedSubject || selectedLevel
              ? 'Try adjusting your filters or search query'
              : 'Be the first to create a study circle!'
          }
          actionLabel="Create Study Circle"
          onAction={() => navigate('/study-circles/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCircles.map((circle) => {
            const availableSpots = circle.maxMembers - circle.members.length;
            const isFull = availableSpots === 0;

            return (
              <Card key={circle._id} className="p-6 hover:shadow-lg transition-shadow">
                <Link to={`/study-circles/${circle._id}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-indigo-600">
                        {circle.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="primary">{circle.subject}</Badge>
                        <Badge variant="outline">{circle.level}</Badge>
                      </div>
                    </div>
                    {circle.visibility === 'private' ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Globe className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </Link>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{circle.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      {circle.members.length}/{circle.maxMembers} Members
                    </span>
                    <span className={`font-medium ${getAvailabilityColor(circle)}`}>
                      {isFull ? 'Full' : `${availableSpots} spots left`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <MessageCircle className="w-4 h-4" />
                      {circle.posts.length} Posts
                    </span>
                    <span className="text-gray-500">
                      by {circle.creator.fullName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    Created {new Date(circle.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/study-circles/${circle._id}`)}
                  >
                    View Details
                  </Button>
                  {!isFull && (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.preventDefault();
                        handleJoinCircle(circle._id);
                      }}
                    >
                      Join Circle
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudyCircles;
