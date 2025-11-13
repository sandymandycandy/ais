import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { BookOpen, Target, Calendar, Clock, Award, TrendingUp } from 'lucide-react';
import { calculateDaysUntil } from '../lib/utils';

const Exams: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [targetedExams, setTargetedExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
    fetchTargetedExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/exams');
      setExams(response.exams || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTargetedExams = async () => {
    try {
      const response = await api.get('/exams/my-targets');
      setTargetedExams(response.exams || []);
    } catch (error) {
      console.error('Error fetching targeted exams:', error);
    }
  };

  const categories = [
    { name: 'Engineering', value: 'engineering', color: 'blue' },
    { name: 'Medical', value: 'medical', color: 'green' },
    { name: 'Government', value: 'government', color: 'indigo' },
    { name: 'Management', value: 'management', color: 'purple' },
    { name: 'Law', value: 'law', color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exam Preparation Zone</h1>
          <p className="text-gray-600 mt-2">Prepare for competitive exams with mock tests and study materials</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant="outline"
              size="sm"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* My Target Exams */}
        {targetedExams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Target Exams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {targetedExams.map((exam) => (
                <Card key={exam._id} hover>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{exam.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{exam.fullName}</p>
                      </div>
                      <Badge variant="success">
                        <Target className="w-3 h-3 mr-1" />
                        Targeted
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Syllabus Progress</span>
                        <span className="font-medium text-gray-900">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <p className="text-xs text-gray-600">Mock Tests</p>
                          <p className="text-lg font-bold text-gray-900">12</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Avg Score</p>
                          <p className="text-lg font-bold text-gray-900">78%</p>
                        </div>
                      </div>

                      <Link to={`/exams/${exam._id}`}>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          Continue Prep
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Exams */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse All Exams</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <Card key={exam._id} hover>
                  <CardHeader>
                    <div>
                      <h3 className="font-bold text-gray-900">{exam.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{exam.fullName}</p>
                      <Badge variant="info" className="mt-2">{exam.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{exam.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Exam Date: Coming Soon</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-2" />
                        <span>{exam.totalStudentsTargeting || 0} students targeting</span>
                      </div>
                    </div>

                    <Link to={`/exams/${exam._id}`}>
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
    </div>
  );
};

export default Exams;
