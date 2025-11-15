import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Star,
  Users,
  BookOpen,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle,
  Award,
  TrendingUp,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import api, { getErrorMessage } from '../lib/api';

interface Mentor {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    profile?: {
      college?: string;
      bio?: string;
    };
  };
  expertise: string[];
  rating: number;
  totalSessions: number;
  availability: 'available' | 'busy' | 'unavailable';
  hourlyRate: number;
  responseTime: string;
  languages: string[];
  experience: string;
  verified: boolean;
  reviews: any[];
}

const Mentors: React.FC = () => {
  const navigate = useNavigate();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating'); // rating, sessions, price

  useEffect(() => {
    fetchMentors();
  }, [selectedExpertise, selectedAvailability, sortBy]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedExpertise) params.append('expertise', selectedExpertise);
      if (selectedAvailability) params.append('availability', selectedAvailability);
      params.append('sortBy', sortBy);

      const response: any = await api.get(`/mentors?${params.toString()}`);
      setMentors(response.mentors || []);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
      mentor.experience.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const expertiseOptions = [
    'Computer Science',
    'Data Science',
    'Web Development',
    'Mobile Development',
    'Machine Learning',
    'Career Guidance',
    'Interview Prep',
    'Mathematics',
    'Physics',
    'Chemistry',
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'busy':
        return 'bg-yellow-100 text-yellow-700';
      case 'unavailable':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'unavailable':
        return 'Unavailable';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Mentor</h1>
        <p className="text-gray-600">Connect with experienced mentors to guide your learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 rounded-lg p-3">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mentors.length}</p>
              <p className="text-sm text-gray-600">Expert Mentors</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mentors.filter((m) => m.verified).length}
              </p>
              <p className="text-sm text-gray-600">Verified</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 rounded-lg p-3">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mentors.length > 0
                  ? (mentors.reduce((sum, m) => sum + m.rating, 0) / mentors.length).toFixed(1)
                  : '0.0'}
              </p>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 rounded-lg p-3">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mentors.reduce((sum, m) => sum + m.totalSessions, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Sessions</p>
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
                placeholder="Search mentors by name, expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="rating">Highest Rated</option>
            <option value="sessions">Most Sessions</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Expertise</option>
                {expertiseOptions.map((expertise) => (
                  <option key={expertise} value={expertise}>
                    {expertise}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* Mentors Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchMentors}>Try Again</Button>
        </Card>
      ) : filteredMentors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Mentors Found"
          description={
            searchQuery || selectedExpertise || selectedAvailability
              ? 'Try adjusting your filters or search query'
              : 'No mentors available at the moment'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor._id} className="p-6 hover:shadow-lg transition-shadow">
              <Link to={`/mentors/${mentor._id}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {mentor.user.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 truncate">
                        {mentor.user.fullName}
                      </h3>
                      {mentor.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-900 ml-1">
                          {mentor.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({mentor.reviews.length} reviews)
                      </span>
                    </div>
                    <Badge className={getAvailabilityColor(mentor.availability)}>
                      {getAvailabilityText(mentor.availability)}
                    </Badge>
                  </div>
                </div>
              </Link>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{mentor.experience}</span>
                </div>

                {mentor.user.profile?.college && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{mentor.user.profile.college}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>Responds in {mentor.responseTime}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <span>{mentor.totalSessions} sessions completed</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Expertise:</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.slice(0, 3).map((exp, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {exp}
                    </Badge>
                  ))}
                  {mentor.expertise.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{mentor.expertise.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Starting at</p>
                  <p className="text-xl font-bold text-indigo-600">₹{mentor.hourlyRate}/hr</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate(`/mentors/${mentor._id}`)}
                  disabled={mentor.availability === 'unavailable'}
                >
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mentors;
