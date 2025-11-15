import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Upload,
  Award,
  TrendingUp,
  Star,
  BookOpen,
  Target,
  Clock,
  Briefcase,
  GraduationCap,
  Phone,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  year: string;
  location: string;
  bio: string;
  skills: string[];
  interests: string[];
  socialLinks: {
    linkedin: string;
    github: string;
    portfolio: string;
  };
}

interface UserStats {
  level: number;
  xp: number;
  coins: number;
  streak: number;
  totalNotes: number;
  totalTests: number;
  targetedExams: number;
  achievements: number;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = useAuthStore();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    course: '',
    year: '',
    location: '',
    bio: '',
    skills: [],
    interests: [],
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: '',
    },
  });

  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    coins: 0,
    streak: 0,
    totalNotes: 0,
    totalTests: 0,
    targetedExams: 0,
    achievements: 0,
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load user profile
      const response = await api.get('/users/profile');
      const userData = response.data.user;

      setProfileData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.profile?.phone || '',
        college: userData.profile?.college || '',
        course: userData.profile?.course || '',
        year: userData.profile?.year || '',
        location: userData.profile?.location || '',
        bio: userData.profile?.bio || '',
        skills: userData.skills?.map((s: any) => s.name) || [],
        interests: userData.profile?.interests || [],
        socialLinks: userData.profile?.socialLinks || {
          linkedin: '',
          github: '',
          portfolio: '',
        },
      });

      setStats({
        level: userData.gamification?.level || 1,
        xp: userData.gamification?.xp || 0,
        coins: userData.gamification?.coins || 0,
        streak: userData.gamification?.streak?.current || 0,
        totalNotes: userData.notes?.length || 0,
        totalTests: userData.mockTestAttempts?.length || 0,
        targetedExams: userData.targetedExams?.length || 0,
        achievements: userData.achievements?.length || 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('socialLinks.')) {
      const key = name.split('.')[1];
      setProfileData({
        ...profileData,
        socialLinks: {
          ...profileData.socialLinks,
          [key]: value,
        },
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((s) => s !== skill),
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData({
        ...profileData,
        interests: [...profileData.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setProfileData({
      ...profileData,
      interests: profileData.interests.filter((i) => i !== interest),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.put('/users/profile', profileData);
      setSuccess(true);
      setEditMode(false);
      await fetchUser(); // Refresh user data
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    loadProfile(); // Reload original data
  };

  const getNextLevelXP = () => {
    return stats.level * 1000;
  };

  const xpProgress = (stats.xp / getNextLevelXP()) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        {!editMode ? (
          <Button onClick={() => setEditMode(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 text-green-800">
            <Award className="w-5 h-5" />
            <p className="font-medium">Profile updated successfully!</p>
          </div>
        </Card>
      )}

      {error && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 text-red-800">
            <X className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <div className="flex items-start gap-6 mb-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {profileData.fullName.charAt(0).toUpperCase() || 'U'}
                </div>
                {editMode && (
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>

              {/* Name and Email */}
              <div className="flex-1">
                {editMode ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {profileData.fullName}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {profileData.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="primary">Level {stats.level}</Badge>
                      <Badge variant="warning">{stats.coins} Coins</Badge>
                      <Badge variant="success">{stats.streak} Day Streak</Badge>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
              {editMode ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Write a short bio about yourself..."
                />
              ) : (
                <p className="text-gray-700">
                  {profileData.bio || 'No bio added yet. Click Edit Profile to add one!'}
                </p>
              )}
            </div>

            {/* Contact & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone
                </label>
                {editMode ? (
                  <Input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                {editMode ? (
                  <Input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.location || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <GraduationCap className="w-4 h-4 inline mr-1" />
                  College
                </label>
                {editMode ? (
                  <Input
                    type="text"
                    name="college"
                    value={profileData.college}
                    onChange={handleChange}
                    placeholder="Your college name"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.college || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Course
                </label>
                {editMode ? (
                  <Input
                    type="text"
                    name="course"
                    value={profileData.course}
                    onChange={handleChange}
                    placeholder="e.g., B.Tech CSE"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.course || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Year
                </label>
                {editMode ? (
                  <select
                    name="year"
                    value={profileData.year}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5+">5th Year+</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {profileData.year ? `${profileData.year} Year` : 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {profileData.skills.map((skill, index) => (
                <Badge key={index} variant="primary" className="flex items-center gap-2">
                  {skill}
                  {editMode && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {profileData.skills.length === 0 && (
                <p className="text-gray-500">No skills added yet</p>
              )}
            </div>
            {editMode && (
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="Add a skill (e.g., Python, React)"
                />
                <Button onClick={addSkill}>Add</Button>
              </div>
            )}
          </Card>

          {/* Interests */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {profileData.interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-2">
                  {interest}
                  {editMode && (
                    <button
                      onClick={() => removeInterest(interest)}
                      className="ml-1 hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {profileData.interests.length === 0 && (
                <p className="text-gray-500">No interests added yet</p>
              )}
            </div>
            {editMode && (
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  placeholder="Add an interest (e.g., Machine Learning)"
                />
                <Button onClick={addInterest}>Add</Button>
              </div>
            )}
          </Card>

          {/* Social Links */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Social Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Linkedin className="w-4 h-4 inline mr-1 text-blue-600" />
                  LinkedIn
                </label>
                {editMode ? (
                  <Input
                    type="url"
                    name="socialLinks.linkedin"
                    value={profileData.socialLinks.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                ) : profileData.socialLinks.linkedin ? (
                  <a
                    href={profileData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    {profileData.socialLinks.linkedin}
                    <LinkIcon className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Github className="w-4 h-4 inline mr-1" />
                  GitHub
                </label>
                {editMode ? (
                  <Input
                    type="url"
                    name="socialLinks.github"
                    value={profileData.socialLinks.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                  />
                ) : profileData.socialLinks.github ? (
                  <a
                    href={profileData.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    {profileData.socialLinks.github}
                    <LinkIcon className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Globe className="w-4 h-4 inline mr-1 text-green-600" />
                  Portfolio
                </label>
                {editMode ? (
                  <Input
                    type="url"
                    name="socialLinks.portfolio"
                    value={profileData.socialLinks.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                  />
                ) : profileData.socialLinks.portfolio ? (
                  <a
                    href={profileData.socialLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    {profileData.socialLinks.portfolio}
                    <LinkIcon className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Level Progress */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Level Progress
            </h3>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-indigo-600">Level {stats.level}</p>
              <p className="text-sm text-gray-600 mt-1">
                {stats.xp} / {getNextLevelXP()} XP
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 text-center">
              {Math.round(xpProgress)}% to next level
            </p>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Coins
                </span>
                <span className="font-bold text-yellow-600">{stats.coins}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Current Streak
                </span>
                <span className="font-bold text-green-600">{stats.streak} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Notes Uploaded
                </span>
                <span className="font-bold text-gray-900">{stats.totalNotes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Tests Taken
                </span>
                <span className="font-bold text-gray-900">{stats.totalTests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Targeted Exams
                </span>
                <span className="font-bold text-gray-900">{stats.targetedExams}</span>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Achievements
            </h3>
            <p className="text-center text-gray-600 py-8">
              {stats.achievements > 0
                ? `${stats.achievements} badges earned!`
                : 'No achievements yet. Keep learning!'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
