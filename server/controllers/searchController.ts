import { Request, Response } from 'express';
import Note from '../models/Note';
import Exam from '../models/Exam';
import Opportunity from '../models/Opportunity';
import User from '../models/User';
import StudyCircle from '../models/StudyCircle';
import Project from '../models/Project';

/**
 * Global search across all entities
 */
export const globalSearch = async (req: Request, res: Response) => {
  try {
    const { q, type, limit = 10 } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchQuery = q.trim();
    const searchLimit = Math.min(Number(limit), 50);

    // Create regex for case-insensitive search
    const regex = new RegExp(searchQuery, 'i');

    const results: any = {
      query: searchQuery,
      notes: [],
      exams: [],
      opportunities: [],
      users: [],
      studyCircles: [],
      projects: [],
      total: 0
    };

    // Search in parallel for better performance
    const searchPromises = [];

    if (!type || type === 'notes') {
      searchPromises.push(
        Note.find({
          $or: [
            { title: regex },
            { description: regex },
            { subject: regex },
            { topic: regex }
          ]
        })
          .limit(searchLimit)
          .select('title description subject topic uploadedBy createdAt')
          .populate('uploadedBy', 'name email avatar')
          .lean()
      );
    } else {
      searchPromises.push(Promise.resolve([]));
    }

    if (!type || type === 'exams') {
      searchPromises.push(
        Exam.find({
          $or: [
            { title: regex },
            { description: regex },
            { subject: regex }
          ]
        })
          .limit(searchLimit)
          .select('title description subject examDate totalMarks')
          .lean()
      );
    } else {
      searchPromises.push(Promise.resolve([]));
    }

    if (!type || type === 'opportunities') {
      searchPromises.push(
        Opportunity.find({
          $or: [
            { title: regex },
            { description: regex },
            { company: regex },
            { location: regex }
          ]
        })
          .limit(searchLimit)
          .select('title description company location type deadline')
          .lean()
      );
    } else {
      searchPromises.push(Promise.resolve([]));
    }

    if (!type || type === 'users') {
      searchPromises.push(
        User.find({
          $or: [
            { name: regex },
            { email: regex },
            { college: regex }
          ]
        })
          .limit(searchLimit)
          .select('name email avatar college branch year')
          .lean()
      );
    } else {
      searchPromises.push(Promise.resolve([]));
    }

    if (!type || type === 'studyCircles') {
      searchPromises.push(
        StudyCircle.find({
          $or: [
            { name: regex },
            { description: regex },
            { subject: regex }
          ]
        })
          .limit(searchLimit)
          .select('name description subject members createdBy')
          .populate('createdBy', 'name avatar')
          .lean()
      );
    } else {
      searchPromises.push(Promise.resolve([]));
    }

    if (!type || type === 'projects') {
      searchPromises.push(
        Project.find({
          $or: [
            { title: regex },
            { description: regex },
            { technologies: regex }
          ]
        })
          .limit(searchLimit)
          .select('title description technologies teamMembers status')
          .lean()
      );
    } else {
      searchPromises.push(Promise.resolve([]));
    }

    const [notes, exams, opportunities, users, studyCircles, projects] = await Promise.all(searchPromises);

    results.notes = notes;
    results.exams = exams;
    results.opportunities = opportunities;
    results.users = users;
    results.studyCircles = studyCircles;
    results.projects = projects;

    results.total = notes.length + exams.length + opportunities.length +
                   users.length + studyCircles.length + projects.length;

    res.json(results);
  } catch (error) {
    console.error('Error in global search:', error);
    res.status(500).json({ message: 'Error performing search' });
  }
};

/**
 * Search suggestions (autocomplete)
 */
export const searchSuggestions = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.json({ suggestions: [] });
    }

    const searchQuery = q.trim();
    const regex = new RegExp(`^${searchQuery}`, 'i');

    // Get suggestions from different sources
    const [noteTitles, examTitles, opportunityTitles] = await Promise.all([
      Note.find({ title: regex })
        .limit(5)
        .select('title')
        .lean(),
      Exam.find({ title: regex })
        .limit(5)
        .select('title')
        .lean(),
      Opportunity.find({ title: regex })
        .limit(5)
        .select('title')
        .lean()
    ]);

    const suggestions = [
      ...noteTitles.map(n => ({ text: n.title, type: 'note' })),
      ...examTitles.map(e => ({ text: e.title, type: 'exam' })),
      ...opportunityTitles.map(o => ({ text: o.title, type: 'opportunity' }))
    ].slice(0, 10);

    res.json({ suggestions });
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    res.status(500).json({ message: 'Error getting suggestions' });
  }
};

/**
 * Advanced search with filters
 */
export const advancedSearch = async (req: Request, res: Response) => {
  try {
    const {
      q,
      type,
      subject,
      dateFrom,
      dateTo,
      minRating,
      tags,
      sortBy = 'relevance',
      limit = 20,
      page = 1
    } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchQuery = q.trim();
    const regex = new RegExp(searchQuery, 'i');
    const skip = (Number(page) - 1) * Number(limit);

    let results: any[] = [];
    let total = 0;

    // Build filter query
    const baseQuery: any = {};
    if (subject) baseQuery.subject = subject;
    if (dateFrom || dateTo) {
      baseQuery.createdAt = {};
      if (dateFrom) baseQuery.createdAt.$gte = new Date(dateFrom as string);
      if (dateTo) baseQuery.createdAt.$lte = new Date(dateTo as string);
    }
    if (minRating) baseQuery.rating = { $gte: Number(minRating) };
    if (tags && typeof tags === 'string') {
      baseQuery.tags = { $in: tags.split(',') };
    }

    // Determine sort order
    let sortOrder: any = { createdAt: -1 };
    if (sortBy === 'rating') sortOrder = { rating: -1 };
    if (sortBy === 'date') sortOrder = { createdAt: -1 };
    if (sortBy === 'views') sortOrder = { views: -1 };

    // Search based on type
    if (type === 'notes') {
      const query = {
        ...baseQuery,
        $or: [
          { title: regex },
          { description: regex },
          { subject: regex }
        ]
      };

      [results, total] = await Promise.all([
        Note.find(query)
          .sort(sortOrder)
          .skip(skip)
          .limit(Number(limit))
          .populate('uploadedBy', 'name email avatar')
          .lean(),
        Note.countDocuments(query)
      ]);
    }

    res.json({
      results,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      hasMore: skip + results.length < total
    });
  } catch (error) {
    console.error('Error in advanced search:', error);
    res.status(500).json({ message: 'Error performing advanced search' });
  }
};
