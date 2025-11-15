import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  TrendingUp,
  Target,
  Layers,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import api, { getErrorMessage } from '../lib/api';

interface Project {
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
  tasks: any[];
  createdAt: string;
}

const Projects: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, selectedStatus]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedStatus) params.append('status', selectedStatus);

      const response = await api.get(`/projects?${params.toString()}`);
      setProjects(response.data.projects || []);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = ['Web Development', 'Mobile App', 'AI/ML', 'Data Science', 'IoT', 'Game Development', 'Research'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCompletionPercentage = (project: Project) => {
    if (project.tasks.length === 0) return 0;
    const completed = project.tasks.filter((t: any) => t.completed).length;
    return Math.round((completed / project.tasks.length) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Collaborate on exciting projects with your peers</p>
        </div>
        <Button onClick={() => navigate('/projects/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 rounded-lg p-3">
              <Layers className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              <p className="text-sm text-gray-600">Total Projects</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter((p) => p.status === 'in-progress').length}
              </p>
              <p className="text-sm text-gray-600">In Progress</p>
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
                {projects.filter((p) => p.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 rounded-lg p-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {projects.reduce((sum, p) => sum + p.teamMembers.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Team Members</p>
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
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchProjects}>Try Again</Button>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Projects Found"
          description={
            searchQuery || selectedCategory || selectedStatus
              ? 'Try adjusting your filters or search query'
              : 'Be the first to create a project!'
          }
          actionLabel="Create Project"
          onAction={() => navigate('/projects/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const completion = getCompletionPercentage(project);
            const teamFull = project.teamMembers.length >= project.maxTeamSize;
            const daysLeft = Math.ceil(
              (new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <Card key={project._id} className="p-6 hover:shadow-lg transition-all animate-fade-in">
                <Link to={`/projects/${project._id}`}>
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 flex-1">
                        {project.title}
                      </h3>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{project.category}</Badge>
                    </div>
                  </div>
                </Link>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      {project.teamMembers.length}/{project.maxTeamSize} Members
                    </span>
                    {teamFull && (
                      <Badge variant="danger" className="text-xs">
                        Full
                      </Badge>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-indigo-600">{completion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>by {project.leader.fullName}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  View Details
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;
