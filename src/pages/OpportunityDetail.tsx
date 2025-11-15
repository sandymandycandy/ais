import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Building,
  Users,
  ExternalLink,
  CheckCircle,
  Bookmark,
  Share2,
  AlertCircle,
  FileText,
  Upload,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import api, { getErrorMessage } from '../lib/api';

interface OpportunityData {
  _id: string;
  title: string;
  company: string;
  type: 'internship' | 'job' | 'scholarship' | 'competition';
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  locationType: 'remote' | 'on-site' | 'hybrid';
  duration: string;
  stipend?: number;
  deadline: string;
  applyLink: string;
  eligibility: string;
  skills: string[];
  posted: string;
  postedBy: {
    _id: string;
    fullName: string;
  };
  applicants: string[];
  bookmarkedBy: string[];
}

const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState<OpportunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null as File | null,
    portfolio: '',
  });
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchOpportunityDetails();
  }, [id]);

  const fetchOpportunityDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await api.get(`/opportunities/${id}`);
      setOpportunity(response.opportunity);
      // Check if user has bookmarked or applied
      // This would come from the API response
      setIsBookmarked(response.isBookmarked || false);
      setHasApplied(response.hasApplied || false);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await api.delete(`/opportunities/${id}/bookmark`);
      } else {
        await api.post(`/opportunities/${id}/bookmark`);
      }
      setIsBookmarked(!isBookmarked);
    } catch (err: any) {
      alert(getErrorMessage(err));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationData({ ...applicationData, resume: e.target.files[0] });
    }
  };

  const handleSubmitApplication = async () => {
    if (!applicationData.coverLetter.trim()) {
      alert('Please write a cover letter');
      return;
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('coverLetter', applicationData.coverLetter);
      if (applicationData.resume) {
        formData.append('resume', applicationData.resume);
      }
      if (applicationData.portfolio) {
        formData.append('portfolio', applicationData.portfolio);
      }

      await api.post(`/opportunities/${id}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Application submitted successfully!');
      setShowApplicationModal(false);
      setHasApplied(true);
      fetchOpportunityDetails();
    } catch (err: any) {
      alert(getErrorMessage(err));
    } finally {
      setApplying(false);
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internship':
        return 'bg-blue-100 text-blue-700';
      case 'job':
        return 'bg-green-100 text-green-700';
      case 'scholarship':
        return 'bg-purple-100 text-purple-700';
      case 'competition':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Opportunity</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/opportunities')}>Back to Opportunities</Button>
        </Card>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(opportunity.deadline);
  const isDeadlineSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining < 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/opportunities')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Opportunities
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={getTypeColor(opportunity.type)}>
                    {opportunity.type.toUpperCase()}
                  </Badge>
                  {isDeadlineSoon && (
                    <Badge className="bg-orange-100 text-orange-700">
                      Deadline Soon
                    </Badge>
                  )}
                  {isExpired && (
                    <Badge className="bg-red-100 text-red-700">
                      Expired
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{opportunity.title}</h1>
                <div className="flex items-center gap-2 text-lg text-gray-700 mb-3">
                  <Building className="w-5 h-5" />
                  {opportunity.company}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {opportunity.location} ({opportunity.locationType})
                  </span>
                  {opportunity.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {opportunity.duration}
                    </span>
                  )}
                  {opportunity.stipend && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ₹{opportunity.stipend.toLocaleString()}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {opportunity.applicants.length} applicants
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={isBookmarked ? 'text-indigo-600' : ''}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>
                Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                {!isExpired && ` (${daysRemaining} days remaining)`}
              </span>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">About the {opportunity.type}</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{opportunity.description}</p>
          </Card>

          {/* Responsibilities */}
          {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Key Responsibilities</h2>
              <ul className="space-y-2">
                {opportunity.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Requirements */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <ul className="space-y-2">
              {opportunity.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Skills */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {opportunity.skills.map((skill, idx) => (
                <Badge key={idx} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Eligibility */}
          {opportunity.eligibility && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Eligibility</h2>
              <p className="text-gray-700">{opportunity.eligibility}</p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <Card className="p-6 sticky top-6">
            {hasApplied ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="font-semibold text-gray-900 mb-2">Application Submitted</p>
                <p className="text-sm text-gray-600">
                  You have already applied for this opportunity
                </p>
              </div>
            ) : isExpired ? (
              <div className="text-center py-4">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <p className="font-semibold text-gray-900 mb-2">Application Closed</p>
                <p className="text-sm text-gray-600">
                  The deadline for this opportunity has passed
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Application Deadline</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(opportunity.deadline).toLocaleDateString()}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      isDeadlineSoon ? 'text-orange-600 font-medium' : 'text-gray-600'
                    }`}
                  >
                    {daysRemaining} days remaining
                  </p>
                </div>

                <Button
                  className="w-full mb-3"
                  onClick={() => setShowApplicationModal(true)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>

                {opportunity.applyLink && (
                  <a
                    href={opportunity.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Apply on Company Site
                    </Button>
                  </a>
                )}
              </>
            )}
          </Card>

          {/* Quick Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Type</p>
                <p className="font-medium text-gray-900 capitalize">{opportunity.type}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Location</p>
                <p className="font-medium text-gray-900">{opportunity.location}</p>
                <p className="text-gray-600 text-xs capitalize">({opportunity.locationType})</p>
              </div>
              {opportunity.duration && (
                <div>
                  <p className="text-gray-600 mb-1">Duration</p>
                  <p className="font-medium text-gray-900">{opportunity.duration}</p>
                </div>
              )}
              {opportunity.stipend && (
                <div>
                  <p className="text-gray-600 mb-1">Stipend</p>
                  <p className="font-medium text-gray-900">
                    ₹{opportunity.stipend.toLocaleString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-600 mb-1">Posted</p>
                <p className="font-medium text-gray-900">
                  {new Date(opportunity.posted).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Share */}
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Share this opportunity</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Twitter
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                LinkedIn
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Copy Link
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Apply for {opportunity.title}</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) =>
                    setApplicationData({ ...applicationData, coverLetter: e.target.value })
                  }
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Explain why you're a great fit for this opportunity..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume (PDF)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    {applicationData.resume ? (
                      <p className="text-sm text-gray-700">{applicationData.resume.name}</p>
                    ) : (
                      <p className="text-sm text-gray-600">Click to upload your resume</p>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio/Website (Optional)
                </label>
                <Input
                  type="url"
                  value={applicationData.portfolio}
                  onChange={(e) =>
                    setApplicationData({ ...applicationData, portfolio: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowApplicationModal(false)}
                disabled={applying}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitApplication}
                disabled={applying || !applicationData.coverLetter.trim()}
                className="flex-1"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OpportunityDetail;
