import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Briefcase, MapPin, Clock, DollarSign, Bookmark, Filter, Search } from 'lucide-react';
import { calculateDaysUntil, formatRelativeTime } from '../lib/utils';

const Opportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchOpportunities();
  }, [selectedType]);

  const fetchOpportunities = async () => {
    try {
      const params = selectedType !== 'all' ? { type: selectedType } : {};
      const response: any = await api.get('/opportunities', { params });
      setOpportunities(response.opportunities || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const opportunityTypes = [
    { value: 'all', label: 'All' },
    { value: 'internship', label: 'Internships' },
    { value: 'job', label: 'Jobs' },
    { value: 'scholarship', label: 'Scholarships' },
    { value: 'competition', label: 'Competitions' },
    { value: 'government-exam', label: 'Govt Exams' },
  ];

  const getTypeColor = (type: string) => {
    const colors: any = {
      internship: 'info',
      job: 'success',
      scholarship: 'warning',
      competition: 'danger',
      'government-exam': 'default',
    };
    return colors[type] || 'default';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Opportunities Portal</h1>
          <p className="text-gray-600 mt-2">
            Discover internships, jobs, scholarships, and competitive exams
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {opportunityTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type.value)}
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search opportunities..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : opportunities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
              <p className="text-gray-600">Check back later for new opportunities</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <Card key={opp._id} hover>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{opp.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{opp.company}</p>
                    </div>
                    <button className="text-gray-400 hover:text-blue-600">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                  <Badge variant={getTypeColor(opp.type)}>
                    {opp.type.replace('-', ' ')}
                  </Badge>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {opp.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {opp.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{opp.location.city || opp.location.type}</span>
                      </div>
                    )}

                    {opp.stipend && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>
                          {opp.stipend.amount} {opp.stipend.currency} / {opp.stipend.period}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-red-600">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>
                        {calculateDaysUntil(opp.applicationDeadline)} days left to apply
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/opportunities/${opp._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button size="sm" className="flex-1">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;
