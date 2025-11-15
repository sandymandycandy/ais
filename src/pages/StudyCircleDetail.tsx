import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Send,
  ThumbsUp,
  MoreVertical,
  Globe,
  Lock,
  Clock,
  BookOpen,
  Star,
  Settings,
  UserPlus,
  AlertCircle,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';
import api, { getErrorMessage } from '../lib/api';

interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    fullName: string;
  };
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
}

interface Member {
  _id: string;
  fullName: string;
  profile?: {
    college?: string;
  };
  joinedAt: string;
}

interface StudyCircleData {
  _id: string;
  name: string;
  description: string;
  subject: string;
  level: string;
  category: string;
  visibility: 'public' | 'private';
  members: Member[];
  maxMembers: number;
  creator: {
    _id: string;
    fullName: string;
  };
  posts: Post[];
  studySchedule?: string;
  meetingLink?: string;
  createdAt: string;
  isActive: boolean;
}

const StudyCircleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [circle, setCircle] = useState<StudyCircleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'posts' | 'members'>('posts');
  const [newPost, setNewPost] = useState('');
  const [postingContent, setPostingContent] = useState(false);

  useEffect(() => {
    fetchCircleDetails();
  }, [id]);

  const fetchCircleDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await api.get(`/study-circles/${id}`);
      setCircle(response.studyCircle);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCircle = async () => {
    try {
      await api.post(`/study-circles/${id}/join`);
      fetchCircleDetails();
    } catch (err: any) {
      alert(getErrorMessage(err));
    }
  };

  const handleLeaveCircle = async () => {
    if (!confirm('Are you sure you want to leave this study circle?')) return;

    try {
      await api.post(`/study-circles/${id}/leave`);
      navigate('/study-circles');
    } catch (err: any) {
      alert(getErrorMessage(err));
    }
  };

  const handlePostContent = async () => {
    if (!newPost.trim()) return;

    try {
      setPostingContent(true);
      await api.post(`/study-circles/${id}/posts`, { content: newPost });
      setNewPost('');
      fetchCircleDetails();
    } catch (err: any) {
      alert(getErrorMessage(err));
    } finally {
      setPostingContent(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await api.post(`/study-circles/${id}/posts/${postId}/like`);
      fetchCircleDetails();
    } catch (err: any) {
      alert(getErrorMessage(err));
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading study circle...</p>
        </div>
      </div>
    );
  }

  if (error || !circle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Circle</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/study-circles')}>Back to Study Circles</Button>
        </Card>
      </div>
    );
  }

  const isMember = circle.members.some((m) => m._id === user?._id);
  const isCreator = circle.creator._id === user?._id;
  const isFull = circle.members.length >= circle.maxMembers;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/study-circles')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Study Circles
        </button>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{circle.name}</h1>
                {circle.visibility === 'private' ? (
                  <Lock className="w-5 h-5 text-gray-400" />
                ) : (
                  <Globe className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="primary">{circle.subject}</Badge>
                <Badge variant="outline">{circle.level}</Badge>
                <Badge variant="secondary">{circle.category}</Badge>
                {circle.isActive && <Badge variant="success">Active</Badge>}
              </div>

              <p className="text-gray-700 mb-4">{circle.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {circle.members.length}/{circle.maxMembers} Members
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {circle.posts.length} Posts
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Created {new Date(circle.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {!isMember && !isFull && (
                <Button onClick={handleJoinCircle}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Circle
                </Button>
              )}
              {isMember && !isCreator && (
                <Button variant="outline" onClick={handleLeaveCircle}>
                  Leave Circle
                </Button>
              )}
              {isCreator && (
                <Button variant="outline" onClick={() => navigate(`/study-circles/${id}/settings`)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              )}
              {isFull && !isMember && (
                <Badge variant="danger" className="px-4 py-2">
                  Circle Full
                </Badge>
              )}
            </div>
          </div>

          {circle.studySchedule && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600 mb-1">Study Schedule:</p>
              <p className="text-gray-900">{circle.studySchedule}</p>
            </div>
          )}

          {circle.meetingLink && isMember && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600 mb-1">Meeting Link:</p>
              <a
                href={circle.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {circle.meetingLink}
              </a>
            </div>
          )}
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'posts'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Discussion ({circle.posts.length})
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'members'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Members ({circle.members.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'posts' ? (
        <div className="space-y-6">
          {/* New Post */}
          {isMember && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Share with the group</h3>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind? Share notes, ask questions, or start a discussion..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
              />
              <div className="flex justify-end">
                <Button onClick={handlePostContent} disabled={postingContent || !newPost.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  {postingContent ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </Card>
          )}

          {/* Posts */}
          {circle.posts.length === 0 ? (
            <Card className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">
                {isMember
                  ? 'Be the first to start a discussion!'
                  : 'Join this circle to see and participate in discussions'}
              </p>
            </Card>
          ) : (
            circle.posts.map((post) => (
              <Card key={post._id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.fullName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{post.author.fullName}</p>
                        <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                      </div>
                      {isMember && (
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikePost(post._id)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          post.likes.includes(user?._id || '')
                            ? 'text-indigo-600 font-medium'
                            : 'text-gray-600 hover:text-indigo-600'
                        }`}
                        disabled={!isMember}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes.length > 0 && post.likes.length}
                      </button>
                      <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments.length > 0 && post.comments.length}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {circle.members.map((member) => (
            <Card key={member._id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {member.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{member.fullName}</p>
                  {member.profile?.college && (
                    <p className="text-sm text-gray-600 truncate">{member.profile.college}</p>
                  )}
                  {member._id === circle.creator._id && (
                    <Badge variant="primary" className="mt-1">
                      <Star className="w-3 h-3 mr-1" />
                      Creator
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyCircleDetail;
