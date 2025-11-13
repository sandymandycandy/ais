import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import {
  FileText,
  Download,
  Share2,
  Star,
  Eye,
  Calendar,
  User,
  Sparkles,
  MessageSquare,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';
import { formatRelativeTime } from '../lib/utils';

const NoteDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'ai-summary' | 'flashcards' | 'clarity-bot'>('content');

  // AI Features State
  const [aiSummary, setAiSummary] = useState('');
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [clarityBotMessages, setClarityBotMessages] = useState<any[]>([]);
  const [clarityBotInput, setClarityBotInput] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  // Rating State
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    fetchNoteDetail();
  }, [id]);

  const fetchNoteDetail = async () => {
    try {
      const response = await api.get(`/notes/${id}`);
      setNote(response.note);

      if (response.note.aiSummary) {
        setAiSummary(response.note.aiSummary);
      }

      if (response.note.flashcards && response.note.flashcards.length > 0) {
        setFlashcards(response.note.flashcards);
      }
    } catch (error) {
      console.error('Error fetching note:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAISummary = async () => {
    setLoadingAI(true);
    try {
      const response = await api.post(`/notes/${id}/summary`);
      setAiSummary(response.summary);
    } catch (error: any) {
      alert(error.message || 'Failed to generate summary');
    } finally {
      setLoadingAI(false);
    }
  };

  const generateFlashcards = async () => {
    setLoadingAI(true);
    try {
      const response = await api.post(`/notes/${id}/flashcards`);
      setFlashcards(response.flashcards);
    } catch (error: any) {
      alert(error.message || 'Failed to generate flashcards');
    } finally {
      setLoadingAI(false);
    }
  };

  const askClarityBot = async () => {
    if (!clarityBotInput.trim()) return;

    const userMessage = { role: 'user', content: clarityBotInput };
    setClarityBotMessages([...clarityBotMessages, userMessage]);
    setClarityBotInput('');
    setLoadingAI(true);

    try {
      const response = await api.post('/notes/clarity-bot', {
        question: clarityBotInput,
        noteId: id,
      });

      const botMessage = { role: 'bot', content: response.answer };
      setClarityBotMessages([...clarityBotMessages, userMessage, botMessage]);
    } catch (error: any) {
      const errorMessage = { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' };
      setClarityBotMessages([...clarityBotMessages, userMessage, errorMessage]);
    } finally {
      setLoadingAI(false);
    }
  };

  const submitRating = async () => {
    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      await api.post(`/notes/${id}/rate`, {
        rating: userRating,
        review: reviewText,
      });
      alert('Rating submitted successfully!');
      fetchNoteDetail();
      setUserRating(0);
      setReviewText('');
    } catch (error: any) {
      alert(error.message || 'Failed to submit rating');
    }
  };

  const handleDownload = () => {
    window.open(note.fileUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Note not found</h2>
          <Button onClick={() => navigate('/notes')}>Back to Notes</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/notes')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Notes</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Note Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{note.title}</h1>
                    <p className="text-gray-600 mb-4">{note.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.subject && <Badge variant="info">{note.subject}</Badge>}
                      {note.topic && <Badge variant="default">{note.topic}</Badge>}
                      {note.verified && <Badge variant="success">Verified</Badge>}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{note.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{note.downloads} downloads</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{note.averageRating?.toFixed(1) || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatRelativeTime(note.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button onClick={handleDownload} className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </Button>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs */}
            <div className="flex space-x-2 mb-6 border-b border-gray-200">
              {[
                { id: 'content', label: 'Content', icon: FileText },
                { id: 'ai-summary', label: 'AI Summary', icon: Sparkles },
                { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
                { id: 'clarity-bot', label: 'Clarity Bot', icon: MessageSquare },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <Card>
              <CardContent>
                {activeTab === 'content' && (
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-4">Note Preview</h3>
                    <div className="bg-gray-100 rounded-lg p-6 mb-4">
                      <p className="text-gray-600 text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        PDF/Document preview would appear here
                      </p>
                      <p className="text-sm text-gray-500 text-center mt-2">
                        File: {note.fileName} ({(note.fileSize / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                    <Button onClick={handleDownload} className="w-full">
                      Download Full Document
                    </Button>
                  </div>
                )}

                {activeTab === 'ai-summary' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">AI-Generated Summary</h3>
                    {aiSummary ? (
                      <div className="prose max-w-none">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <p className="text-gray-700 whitespace-pre-wrap">{aiSummary}</p>
                        </div>
                        <Button
                          onClick={generateAISummary}
                          variant="outline"
                          className="mt-4"
                          disabled={loadingAI}
                        >
                          {loadingAI ? 'Regenerating...' : 'Regenerate Summary'}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 mb-4">No AI summary generated yet</p>
                        <Button
                          onClick={generateAISummary}
                          disabled={loadingAI}
                          className="flex items-center space-x-2 mx-auto"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{loadingAI ? 'Generating...' : 'Generate AI Summary'}</span>
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'flashcards' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Study Flashcards</h3>
                    {flashcards.length > 0 ? (
                      <div>
                        <div className="bg-white border-2 border-gray-300 rounded-lg p-8 mb-4 min-h-[300px] flex flex-col items-center justify-center">
                          <div className="text-center">
                            <p className="text-sm text-gray-500 mb-4">
                              Card {currentFlashcard + 1} of {flashcards.length}
                            </p>
                            <div className="text-xl font-medium text-gray-900 mb-6">
                              {flashcards[currentFlashcard].question}
                            </div>
                            {showFlashcardAnswer && (
                              <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-gray-700">{flashcards[currentFlashcard].answer}</p>
                                <Badge variant="info" className="mt-4">
                                  {flashcards[currentFlashcard].difficulty}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setCurrentFlashcard(Math.max(0, currentFlashcard - 1));
                              setShowFlashcardAnswer(false);
                            }}
                            disabled={currentFlashcard === 0}
                          >
                            Previous
                          </Button>

                          <Button
                            onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
                            variant={showFlashcardAnswer ? 'secondary' : 'primary'}
                          >
                            {showFlashcardAnswer ? 'Hide Answer' : 'Show Answer'}
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => {
                              setCurrentFlashcard(Math.min(flashcards.length - 1, currentFlashcard + 1));
                              setShowFlashcardAnswer(false);
                            }}
                            disabled={currentFlashcard === flashcards.length - 1}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 mb-4">No flashcards generated yet</p>
                        <Button
                          onClick={generateFlashcards}
                          disabled={loadingAI}
                          className="flex items-center space-x-2 mx-auto"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{loadingAI ? 'Generating...' : 'Generate Flashcards'}</span>
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'clarity-bot' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Ask Clarity Bot</h3>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto">
                      {clarityBotMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-2">Ask me anything about this note!</p>
                          <p className="text-sm text-gray-500">
                            I can help explain concepts, answer questions, and clarify doubts.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {clarityBotMessages.map((msg, idx) => (
                            <div
                              key={idx}
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-900'
                                }`}
                              >
                                {msg.content}
                              </div>
                            </div>
                          ))}
                          {loadingAI && (
                            <div className="flex justify-start">
                              <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <div className="flex space-x-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Input
                        placeholder="Ask a question about this note..."
                        value={clarityBotInput}
                        onChange={(e) => setClarityBotInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && askClarityBot()}
                        disabled={loadingAI}
                      />
                      <Button onClick={askClarityBot} disabled={loadingAI || !clarityBotInput.trim()}>
                        Send
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Uploader Info */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Uploaded By</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {note.uploadedBy?.name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {note.uploadedBy?.college || 'Student'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rate This Note */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Rate This Note</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setUserRating(rating)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            rating <= userRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    placeholder="Write a review (optional)..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />

                  <Button onClick={submitRating} className="w-full" disabled={userRating === 0}>
                    Submit Rating
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Note Info */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Note Information</h3>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">File Type:</span>
                  <span className="font-medium text-gray-900">{note.fileType.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">File Size:</span>
                  <span className="font-medium text-gray-900">
                    {(note.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uploaded:</span>
                  <span className="font-medium text-gray-900">{formatRelativeTime(note.createdAt)}</span>
                </div>
                {note.professor && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Professor:</span>
                    <span className="font-medium text-gray-900">{note.professor}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
