import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  MessageCircle,
  Award,
  CheckCircle,
  Users,
  BookOpen,
  DollarSign,
  Video,
  AlertCircle,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import api, { getErrorMessage } from '../lib/api';

interface Review {
  _id: string;
  student: {
    fullName: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface MentorData {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    profile?: {
      bio?: string;
      college?: string;
      location?: string;
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
  reviews: Review[];
  bio: string;
  education: string;
  achievements: string[];
}

const MentorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingDuration, setBookingDuration] = useState('1');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    fetchMentorDetails();
  }, [id]);

  const fetchMentorDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await api.get(`/mentors/${id}`);
      setMentor(response.mentor);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async () => {
    if (!bookingDate || !bookingTime) {
      alert('Please select date and time');
      return;
    }

    setBookingInProgress(true);
    try {
      await api.post(`/mentors/${id}/book`, {
        date: bookingDate,
        time: bookingTime,
        duration: parseInt(bookingDuration),
        message: bookingMessage,
      });
      alert('Booking request sent! The mentor will confirm shortly.');
      setShowBookingModal(false);
      // Reset form
      setBookingDate('');
      setBookingTime('');
      setBookingDuration('1');
      setBookingMessage('');
    } catch (err: any) {
      alert(getErrorMessage(err));
    } finally {
      setBookingInProgress(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Mentor</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/mentors')}>Back to Mentors</Button>
        </Card>
      </div>
    );
  }

  const totalCost = mentor.hourlyRate * parseInt(bookingDuration);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/mentors')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Mentors
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                {mentor.user.fullName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{mentor.user.fullName}</h1>
                  {mentor.verified && (
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <p className="text-lg text-gray-700 mb-3">{mentor.experience}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(mentor.rating))}
                    <span className="ml-2 text-lg font-semibold text-gray-900">
                      {mentor.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-600">({mentor.reviews.length} reviews)</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  {mentor.user.profile?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {mentor.user.profile.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Responds in {mentor.responseTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {mentor.totalSessions} sessions completed
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* About */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{mentor.bio || mentor.user.profile?.bio || 'No bio provided.'}</p>
          </Card>

          {/* Expertise */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise.map((exp, idx) => (
                <Badge key={idx} variant="primary">
                  {exp}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Education */}
          {mentor.education && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Education
              </h2>
              <p className="text-gray-700">{mentor.education}</p>
            </Card>
          )}

          {/* Achievements */}
          {mentor.achievements && mentor.achievements.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Achievements
              </h2>
              <ul className="space-y-2">
                {mentor.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Reviews */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Reviews ({mentor.reviews.length})</h2>
            {mentor.reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {mentor.reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">{review.student.fullName}</p>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <Card className="p-6 sticky top-6">
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-indigo-600">₹{mentor.hourlyRate}</span>
                <span className="text-gray-600">/hour</span>
              </div>
              <Badge
                className={
                  mentor.availability === 'available'
                    ? 'bg-green-100 text-green-700'
                    : mentor.availability === 'busy'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }
              >
                {mentor.availability === 'available'
                  ? 'Available'
                  : mentor.availability === 'busy'
                  ? 'Busy'
                  : 'Unavailable'}
              </Badge>
            </div>

            <Button
              className="w-full mb-3"
              onClick={() => setShowBookingModal(true)}
              disabled={mentor.availability === 'unavailable'}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Session
            </Button>

            <Button variant="outline" className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Message
            </Button>

            <div className="mt-6 pt-6 border-t space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Video className="w-4 h-4 text-indigo-600" />
                <span>Video sessions via Zoom/Meet</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Responds within {mentor.responseTime}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>{mentor.totalSessions} sessions completed</span>
              </div>
            </div>
          </Card>

          {/* Languages */}
          {mentor.languages.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.languages.map((lang, idx) => (
                  <Badge key={idx} variant="outline">
                    {lang}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Book a Session</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <Input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  value={bookingDuration}
                  onChange={(e) => setBookingDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1">1 hour - ₹{mentor.hourlyRate}</option>
                  <option value="1.5">1.5 hours - ₹{mentor.hourlyRate * 1.5}</option>
                  <option value="2">2 hours - ₹{mentor.hourlyRate * 2}</option>
                  <option value="3">3 hours - ₹{mentor.hourlyRate * 3}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="What would you like to discuss?"
                />
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Total Cost:</span>
                  <span className="text-2xl font-bold text-indigo-600">₹{totalCost}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBookingModal(false)}
                disabled={bookingInProgress}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookSession}
                disabled={bookingInProgress}
                className="flex-1"
              >
                {bookingInProgress ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MentorDetail;
