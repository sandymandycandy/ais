import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  BookOpen,
  Award,
  TrendingUp,
  Play,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import api from '../lib/api';

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  marks: number;
  negativeMarks: number;
}

interface TestData {
  _id: string;
  title: string;
  exam: { _id: string; name: string };
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  difficulty: string;
  questions: Question[];
}

interface Answer {
  questionId: string;
  selectedOption: number | null;
  isMarkedForReview: boolean;
}

interface TestResult {
  score: number;
  totalMarks: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  percentage: number;
  timeTaken: number;
  answers: {
    questionId: string;
    isCorrect: boolean;
    selectedOption: number | null;
    correctAnswer: number;
  }[];
}

const MockTest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Test state
  const [test, setTest] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test taking state
  const [testStarted, setTestStarted] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Results
  const [results, setResults] = useState<TestResult | null>(null);

  useEffect(() => {
    fetchTestDetails();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (testStarted && !testSubmitted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStarted, testSubmitted, timeRemaining]);

  const fetchTestDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/mock-tests/${id}`);
      setTest(response.data.mockTest);
      setTimeRemaining(response.data.mockTest.duration * 60); // Convert minutes to seconds
      // Initialize answers array
      const initialAnswers: Answer[] = response.data.mockTest.questions.map((q: Question) => ({
        questionId: q._id,
        selectedOption: null,
        isMarkedForReview: false,
      }));
      setAnswers(initialAnswers);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load test details');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex].selectedOption = optionIndex;
    setAnswers(newAnswers);
  };

  const handleMarkForReview = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex].isMarkedForReview =
      !newAnswers[currentQuestionIndex].isMarkedForReview;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (test?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const getQuestionStatus = (index: number) => {
    const answer = answers[index];
    if (answer.isMarkedForReview) return 'review';
    if (answer.selectedOption !== null) return 'answered';
    return 'not-answered';
  };

  const getAnsweredCount = () => answers.filter((a) => a.selectedOption !== null).length;
  const getMarkedForReviewCount = () => answers.filter((a) => a.isMarkedForReview).length;
  const getNotAnsweredCount = () => answers.filter((a) => a.selectedOption === null).length;

  const handleAutoSubmit = async () => {
    await submitTest();
  };

  const handleSubmitTest = () => {
    setShowSubmitConfirm(true);
  };

  const submitTest = async () => {
    try {
      setSubmitting(true);
      const timeTaken = test ? test.duration * 60 - timeRemaining : 0;

      const response = await api.post(`/mock-tests/${id}/submit`, {
        answers: answers.map((a) => ({
          questionId: a.questionId,
          selectedOption: a.selectedOption,
        })),
        timeTaken,
      });

      setResults(response.data.result);
      setTestSubmitted(true);
      setShowSubmitConfirm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Test</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/exams')}>Back to Exams</Button>
        </Card>
      </div>
    );
  }

  // Results Screen
  if (testSubmitted && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <Card className="p-8 mb-6 text-center">
            <div className="mb-6">
              {results.percentage >= 70 ? (
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              ) : results.percentage >= 40 ? (
                <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h1>
              <p className="text-gray-600">{test.title}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-indigo-600">{results.score}</p>
                <p className="text-sm text-gray-600">Score</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-green-600">{results.percentage}%</p>
                <p className="text-sm text-gray-600">Percentage</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-blue-600">{results.correctAnswers}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-red-600">{results.incorrectAnswers}</p>
                <p className="text-sm text-gray-600">Incorrect</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-sm text-gray-600 mb-6">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Time Taken: {formatTime(results.timeTaken)}
              </span>
              <span>•</span>
              <span>Unanswered: {results.unanswered}</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button onClick={() => navigate('/exams')}>
                <Home className="w-4 h-4 mr-2" />
                Back to Exams
              </Button>
              <Button variant="outline" onClick={() => navigate(`/exams/${test.exam._id}`)}>
                <BookOpen className="w-4 h-4 mr-2" />
                View Exam Details
              </Button>
            </div>
          </Card>

          {/* Detailed Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Detailed Solutions</h2>
            <div className="space-y-6">
              {test.questions.map((question, index) => {
                const userAnswer = results.answers.find((a) => a.questionId === question._id);
                const isCorrect = userAnswer?.isCorrect || false;

                return (
                  <div
                    key={question._id}
                    className={`border-l-4 p-4 rounded-r-lg ${
                      isCorrect
                        ? 'border-green-500 bg-green-50'
                        : userAnswer?.selectedOption !== null
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : userAnswer?.selectedOption !== null ? (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">
                          Question {index + 1}
                        </h3>
                        <p className="text-gray-800 mb-3">{question.question}</p>

                        <div className="space-y-2 mb-3">
                          {question.options.map((option, optIdx) => {
                            const isUserAnswer = userAnswer?.selectedOption === optIdx;
                            const isCorrectAnswer = question.correctAnswer === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`p-3 rounded-lg border ${
                                  isCorrectAnswer
                                    ? 'border-green-500 bg-green-100'
                                    : isUserAnswer
                                    ? 'border-red-500 bg-red-100'
                                    : 'border-gray-200 bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-700">
                                    {String.fromCharCode(65 + optIdx)}.
                                  </span>
                                  <span className="flex-1">{option}</span>
                                  {isCorrectAnswer && (
                                    <Badge variant="success">Correct</Badge>
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <Badge variant="danger">Your Answer</Badge>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {question.explanation && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-medium text-blue-900 mb-1">
                              Explanation:
                            </p>
                            <p className="text-sm text-blue-800">{question.explanation}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Marks: +{question.marks}</span>
                          {question.negativeMarks > 0 && (
                            <span className="text-red-600">
                              Negative: -{question.negativeMarks}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Instructions Screen
  if (!testStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
        <Card className="max-w-3xl w-full p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.title}</h1>
          <p className="text-gray-600 mb-6">{test.exam.name}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{test.totalQuestions}</p>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{test.totalMarks}</p>
              <p className="text-sm text-gray-600">Total Marks</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{test.duration}</p>
              <p className="text-sm text-gray-600">Minutes</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Badge variant={test.difficulty === 'Easy' ? 'success' : test.difficulty === 'Medium' ? 'warning' : 'danger'}>
                {test.difficulty}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">Difficulty</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>The test contains {test.totalQuestions} multiple choice questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Total duration: {test.duration} minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Each question has only one correct answer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>You can mark questions for review and come back to them later</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>The timer will start when you click "Start Test"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Test will auto-submit when time runs out</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span className="font-medium">Once submitted, you cannot change your answers</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigate(`/exams/${test.exam._id}`)}>
              Cancel
            </Button>
            <Button onClick={handleStartTest} size="lg">
              <Play className="w-5 h-5 mr-2" />
              Start Test
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Test Taking Interface
  const currentQuestion = test.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{test.title}</h1>
              <p className="text-sm text-gray-600">{test.exam.name}</p>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-lg font-bold">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Area */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Question {currentQuestionIndex + 1} of {test.questions.length}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">+{currentQuestion.marks} marks</Badge>
                  {currentQuestion.negativeMarks > 0 && (
                    <Badge variant="danger">-{currentQuestion.negativeMarks}</Badge>
                  )}
                </div>
              </div>

              <p className="text-lg text-gray-800 mb-6">{currentQuestion.question}</p>

              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => handleSelectOption(optionIndex)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      currentAnswer.selectedOption === optionIndex
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-gray-700 min-w-[24px]">
                        {String.fromCharCode(65 + optionIndex)}.
                      </span>
                      <span className="flex-1">{option}</span>
                      {currentAnswer.selectedOption === optionIndex && (
                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleMarkForReview}
                  className={currentAnswer.isMarkedForReview ? 'border-yellow-500 text-yellow-700' : ''}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  {currentAnswer.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === test.questions.length - 1}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Question Palette */}
          <div>
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Question Palette</h3>

              <div className="grid grid-cols-5 gap-2 mb-6">
                {test.questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  return (
                    <button
                      key={index}
                      onClick={() => handleJumpToQuestion(index)}
                      className={`aspect-square rounded-lg font-medium text-sm transition-all ${
                        currentQuestionIndex === index
                          ? 'ring-2 ring-indigo-500 ring-offset-2'
                          : ''
                      } ${
                        status === 'answered'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : status === 'review'
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 border border-green-500"></div>
                    <span className="text-gray-700">Answered</span>
                  </div>
                  <span className="font-medium text-gray-900">{getAnsweredCount()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-100 border border-gray-500"></div>
                    <span className="text-gray-700">Not Answered</span>
                  </div>
                  <span className="font-medium text-gray-900">{getNotAnsweredCount()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-500"></div>
                    <span className="text-gray-700">Marked</span>
                  </div>
                  <span className="font-medium text-gray-900">{getMarkedForReviewCount()}</span>
                </div>
              </div>

              <Button onClick={handleSubmitTest} variant="primary" className="w-full">
                Submit Test
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Test?</h2>
            <div className="space-y-3 mb-6 text-sm">
              <p className="text-gray-700">
                Are you sure you want to submit? You have:
              </p>
              <ul className="space-y-1 text-gray-600">
                <li>• {getAnsweredCount()} questions answered</li>
                <li>• {getNotAnsweredCount()} questions not answered</li>
                <li>• {getMarkedForReviewCount()} questions marked for review</li>
              </ul>
              <p className="text-red-600 font-medium">
                Once submitted, you cannot change your answers!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSubmitConfirm(false)}
                disabled={submitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={submitTest}
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? 'Submitting...' : 'Yes, Submit'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MockTest;
