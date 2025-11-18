import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Calendar, Briefcase, Users, Folder, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDebounce } from '../../hooks/useDebounce';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface SearchResult {
  query: string;
  notes: any[];
  exams: any[];
  opportunities: any[];
  users: any[];
  studyCircles: any[];
  projects: any[];
  total: number;
}

const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  // Keyboard shortcut Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults(null);
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/search`, {
          params: { q: debouncedQuery, limit: 5 },
          headers: { Authorization: `Bearer ${token}` }
        });
        setResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleResultClick = (type: string, id: string) => {
    setIsOpen(false);
    setQuery('');
    setResults(null);

    const routes: Record<string, string> = {
      note: `/notes/${id}`,
      exam: `/exams/${id}`,
      opportunity: `/opportunities/${id}`,
      user: `/profile/${id}`,
      studyCircle: `/study-circles/${id}`,
      project: `/projects/${id}`
    };

    navigate(routes[type] || '/');
  };

  const getIcon = (type: string) => {
    const icons: Record<string, any> = {
      note: FileText,
      exam: Calendar,
      opportunity: Briefcase,
      user: User,
      studyCircle: Users,
      project: Folder
    };
    const Icon = icons[type] || Search;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Search...</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-start justify-center pt-20 px-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

            <div ref={searchRef} className="relative w-full max-w-2xl">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search notes, exams, opportunities, users..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  {query && (
                    <button onClick={() => setQuery('')} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  {loading && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto p-2">
                  {!query && (
                    <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Start typing to search...</p>
                      <p className="text-xs mt-1">Search across notes, exams, opportunities, and more</p>
                    </div>
                  )}

                  {query && results && results.total === 0 && (
                    <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No results found for "{query}"</p>
                    </div>
                  )}

                  {results && results.total > 0 && (
                    <div className="space-y-4">
                      {/* Notes */}
                      {results.notes.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                            Notes
                          </div>
                          {results.notes.map((note: any) => (
                            <button
                              key={note._id}
                              onClick={() => handleResultClick('note', note._id)}
                              className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                {getIcon('note')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white truncate">
                                  {note.title}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {note.subject} • {note.topic}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Exams */}
                      {results.exams.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                            Exams
                          </div>
                          {results.exams.map((exam: any) => (
                            <button
                              key={exam._id}
                              onClick={() => handleResultClick('exam', exam._id)}
                              className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                {getIcon('exam')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white truncate">
                                  {exam.title}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {exam.subject}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Opportunities */}
                      {results.opportunities.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                            Opportunities
                          </div>
                          {results.opportunities.map((opp: any) => (
                            <button
                              key={opp._id}
                              onClick={() => handleResultClick('opportunity', opp._id)}
                              className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                {getIcon('opportunity')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white truncate">
                                  {opp.title}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {opp.company} • {opp.type}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Users */}
                      {results.users.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                            Users
                          </div>
                          {results.users.map((user: any) => (
                            <button
                              key={user._id}
                              onClick={() => handleResultClick('user', user._id)}
                              className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                {getIcon('user')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white truncate">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {user.college}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Study Circles */}
                      {results.studyCircles.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                            Study Circles
                          </div>
                          {results.studyCircles.map((circle: any) => (
                            <button
                              key={circle._id}
                              onClick={() => handleResultClick('studyCircle', circle._id)}
                              className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                              <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                                {getIcon('studyCircle')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white truncate">
                                  {circle.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {circle.subject}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Projects */}
                      {results.projects.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                            Projects
                          </div>
                          {results.projects.map((project: any) => (
                            <button
                              key={project._id}
                              onClick={() => handleResultClick('project', project._id)}
                              className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                              <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                                {getIcon('project')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white truncate">
                                  {project.title}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {project.status}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  <span>Press ESC to close</span>
                  {results && results.total > 0 && (
                    <span>{results.total} results found</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
