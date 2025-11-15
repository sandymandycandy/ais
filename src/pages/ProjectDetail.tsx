import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Calendar,
  CheckCircle,
  Circle,
  Plus,
  MoreVertical,
  Target,
  Clock,
  AlertCircle,
  MessageCircle,
  UserPlus,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ToastProvider';
import api, { getErrorMessage } from '../lib/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo?: {
    _id: string;
    fullName: string;
  };
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface ProjectData {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'planning' | 'in-progress' | 'completed';
  teamMembers: any[];
  maxTeamSize: number;
  leader: {
    _id: string;
    fullName: string;
  };
  tags: string[];
  deadline: string;
  tasks: Task[];
  githubRepo?: string;
  createdAt: string;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showToast } = useToast();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'tasks' | 'team'>('tasks');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.project);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async () => {
    try {
      await api.post(`/projects/${id}/join`);
      showToast('Joined project successfully!', 'success');
      fetchProjectDetails();
    } catch (err: any) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await api.post(`/projects/${id}/tasks/${taskId}/toggle`);
      fetchProjectDetails();
    } catch (err: any) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      await api.post(`/projects/${id}/tasks`, { title: newTaskTitle });
      setNewTaskTitle('');
      showToast('Task added successfully!', 'success');
      fetchProjectDetails();
    } catch (err: any) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Project</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </Card>
      </div>
    );
  }

  const isMember = project.teamMembers.some((m) => m._id === user?._id);
  const isLeader = project.leader._id === user?._id;
  const teamFull = project.teamMembers.length >= project.maxTeamSize;
  const completion = project.tasks.length
    ? Math.round((project.tasks.filter((t) => t.status === 'completed').length / project.tasks.length) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Projects
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="primary">{project.category}</Badge>
                  <Badge
                    className={
                      project.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : project.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  >
                    {project.status.replace('-', ' ')}
                  </Badge>
                  {project.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              {!isMember && !teamFull && (
                <Button onClick={handleJoinProject}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Project
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Team Size</p>
                <p className="font-semibold text-gray-900">
                  {project.teamMembers.length}/{project.maxTeamSize}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Progress</p>
                <p className="font-semibold text-indigo-600">{completion}%</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Deadline</p>
                <p className="font-semibold text-gray-900">
                  {new Date(project.deadline).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Leader</p>
                <p className="font-semibold text-gray-900">{project.leader.fullName}</p>
              </div>
            </div>

            {project.githubRepo && (
              <div className="mt-4 pt-4 border-t">
                <a
                  href={project.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View on GitHub →
                </a>
              </div>
            )}
          </Card>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'tasks'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Tasks ({project.tasks.length})
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'team'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Team ({project.teamMembers.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'tasks' ? (
            <div className="space-y-4">
              {/* Add Task */}
              {isMember && (
                <Card className="p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                      placeholder="Add a new task..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              )}

              {/* Task List */}
              {project.tasks.length === 0 ? (
                <Card className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
                  <p className="text-gray-600">
                    {isMember ? 'Add your first task above' : 'Join the project to see tasks'}
                  </p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {project.tasks.map((task) => (
                    <Card key={task._id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => isMember && handleToggleTask(task._id)}
                          disabled={!isMember}
                          className="mt-0.5"
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h4
                            className={`font-medium ${
                              task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            {task.assignedTo && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {task.assignedTo.fullName}
                              </span>
                            )}
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            {task.priority && (
                              <Badge
                                className={
                                  task.priority === 'high'
                                    ? 'bg-red-100 text-red-700'
                                    : task.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                                }
                              >
                                {task.priority}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.teamMembers.map((member) => (
                <Card key={member._id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {member.fullName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{member.fullName}</p>
                      {member._id === project.leader._id && (
                        <Badge variant="primary" className="mt-1">
                          <Target className="w-3 h-3 mr-1" />
                          Leader
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Project Progress</h3>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-indigo-600">{completion}%</p>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tasks</span>
                <span className="font-medium text-gray-900">{project.tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-green-600">
                  {project.tasks.filter((t) => t.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">In Progress</span>
                <span className="font-medium text-blue-600">
                  {project.tasks.filter((t) => t.status === 'in-progress').length}
                </span>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Timeline</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Started</p>
                <p className="font-medium text-gray-900">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Deadline</p>
                <p className="font-medium text-gray-900">
                  {new Date(project.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
