import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { FileText, Upload, Search, Star, Eye, Download, Filter } from 'lucide-react';
import { formatRelativeTime } from '../lib/utils';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response: any = await api.get('/notes');
      setNotes(response.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Smart Notes Hub</h1>
            <p className="text-gray-600 mt-2">Access and share study materials with AI-powered features</p>
          </div>
          <Link to="/notes/upload">
            <Button className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload Notes</span>
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes by title, subject, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : notes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-600 mb-4">Start by uploading your first note or browse community notes</p>
              <Link to="/notes/upload">
                <Button>Upload Your First Note</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note._id} hover>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{note.title}</h3>
                      {note.subject && (
                        <Badge variant="info">{note.subject}</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{note.averageRating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{note.description || 'No description'}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{note.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{note.downloads || 0}</span>
                      </div>
                    </div>
                    <span>{formatRelativeTime(note.createdAt)}</span>
                  </div>

                  <Link to={`/notes/${note._id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
