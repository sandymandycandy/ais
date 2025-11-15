import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  Circle,
  Target,
  ExternalLink,
  FileText,
  Play,
  Award,
  AlertCircle,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import api from '../lib/api';

interface SyllabusSection {
  _id: string;
  section: string;
  topics: string[];
  completed: boolean;
}

interface MockTest {
  _id: string;
  title: string;
  duration: number;
  totalQuestions: number;
  difficulty: string;
  attemptCount: number;
}

interface ExamData {
  _id: string;
  name: string;
  fullName: string;
  category: string;
  description: string;
  eligibility: string;
  examDate: string;
  registrationDeadline: string;
  examPattern: {
    totalMarks: number;
    duration: number;
    sections: string[];
    negativeMarking: boolean;
  };
  syllabus: SyllabusSection[];
  officialWebsite: string;
  isTargeted: boolean;
  mockTests: MockTest[];
}

const ExamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targeting, setTargeting] = useState(false);

  // Calculate syllabus progress
  const syllabusProgress = exam
    ? Math.round((exam.syllabus.filter((s) => s.completed).length / exam.syllabus.length) * 100)
    : 0;

  useEffect(() => {
    fetchExamDetails();
  }, [id]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      const response: any = await api.get(`/exams/${id}`);
      setExam(response.exam);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load exam details');
    } finally {
      setLoading(false);
    }
  };

  const toggleTargetExam = async () => {
    try {
      setTargeting(true);
      const response: any = await api.post(`/exams/${id}/target`);
      setExam({ ...exam!, isTargeted: response.isTargeted });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update target status');
    } finally {
      setTargeting(false);
    }
  };

  const toggleTopicCompletion = async (sectionId: string) => {
    try {
      await api.post(`/exams/${id}/syllabus/${sectionId}/toggle`);
      // Update local state
      setExam({
        ...exam!,
        syllabus: exam!.syllabus.map((section) =>
          section._id === sectionId ? { ...section, completed: !section.completed } : section
        ),
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update progress');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    const examDate = new Date(dateString);
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Exam</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/exams')}>Back to Exams</Button>
        </Card>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(exam.examDate);
  const registrationDaysRemaining = getDaysRemaining(exam.registrationDeadline);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/exams')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Exams
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{exam.name}</h1>
              <Badge variant="primary">{exam.category}</Badge>
              {exam.isTargeted && (
                <Badge variant="success">
                  <Target className="w-3 h-3 mr-1" />
                  Targeted
                </Badge>
              )}
            </div>
            <p className="text-lg text-gray-600 mb-2">{exam.fullName}</p>
            <p className="text-gray-700">{exam.description}</p>
          </div>
          <Button onClick={toggleTargetExam} disabled={targeting} variant={exam.isTargeted ? 'outline' : 'primary'}>
            <Target className="w-4 h-4 mr-2" />
            {exam.isTargeted ? 'Remove Target' : 'Target Exam'}
          </Button>
        </div>
      </div>

      {/* Important Dates Alert */}
      {(registrationDaysRemaining <= 30 || daysRemaining <= 60) && (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">Important Dates Approaching!</p>
              <div className="text-sm text-yellow-800 mt-1 space-y-1">
                {registrationDaysRemaining <= 30 && registrationDaysRemaining > 0 && (
                  <p>• Registration closes in {registrationDaysRemaining} days</p>
                )}
                {daysRemaining <= 60 && daysRemaining > 0 && (
                  <p>• Exam in {daysRemaining} days</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exam Details */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Exam Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Exam Date</p>
                    <p className="font-medium text-gray-900">{formatDate(exam.examDate)}</p>
                    <p className="text-xs text-gray-500">{daysRemaining} days remaining</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{exam.examPattern.duration} minutes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Eligibility</p>
                    <p className="font-medium text-gray-900">{exam.eligibility}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Total Marks</p>
                    <p className="font-medium text-gray-900">{exam.examPattern.totalMarks}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Registration Deadline</p>
                <p className="font-medium text-gray-900">{formatDate(exam.registrationDeadline)}</p>
                <p className="text-xs text-gray-500">{registrationDaysRemaining} days remaining</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Exam Pattern</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Sections:</strong> {exam.examPattern.sections.join(', ')}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Negative Marking:</strong>{' '}
                    {exam.examPattern.negativeMarking ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <a
                  href={exam.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Visit Official Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Card>

          {/* Syllabus Tracker */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Syllabus Tracker</h2>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-600">{syllabusProgress}%</p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${syllabusProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              {exam.syllabus.map((section) => (
                <div key={section._id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTopicCompletion(section._id)}
                      className="mt-0.5 transition-colors"
                    >
                      {section.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3
                        className={`font-medium mb-2 ${
                          section.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}
                      >
                        {section.section}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {section.topics.map((topic, idx) => (
                          <Badge key={idx} variant={section.completed ? 'secondary' : 'outline'}>
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Mock Tests */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Available Mock Tests
            </h2>

            {exam.mockTests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No mock tests available yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {exam.mockTests.map((test) => (
                  <div
                    key={test._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{test.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {test.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {test.totalQuestions} questions
                        </span>
                        <Badge
                          variant={
                            test.difficulty === 'Easy'
                              ? 'success'
                              : test.difficulty === 'Medium'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {test.difficulty}
                        </Badge>
                      </div>
                      {test.attemptCount > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Attempted {test.attemptCount} time{test.attemptCount > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <Link to={`/mock-tests/${test._id}`}>
                      <Button size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Start Test
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Syllabus</span>
                  <span className="font-medium text-indigo-600">{syllabusProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${syllabusProgress}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Mock Tests</span>
                  <span className="font-medium text-gray-900">
                    {exam.mockTests.filter((t) => t.attemptCount > 0).length} / {exam.mockTests.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        exam.mockTests.length > 0
                          ? (exam.mockTests.filter((t) => t.attemptCount > 0).length /
                              exam.mockTests.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Preparation Tips */}
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Preparation Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Complete syllabus tracker topics regularly</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Take mock tests to assess your preparation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Review previous year papers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Focus on weak areas identified in tests</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Maintain consistent study schedule</span>
              </li>
            </ul>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Find Study Materials
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Join Study Circle
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Set Study Schedule
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;
