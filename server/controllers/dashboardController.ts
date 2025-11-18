import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { MockTestAttempt } from '../models/MockTest';
import { OpportunityApplication } from '../models/Opportunity';

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const recentAttempts = await MockTestAttempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('test', 'title');

    const applications = await OpportunityApplication.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('opportunity', 'title company');

    res.json({
      success: true,
      data: {
        user,
        recentAttempts,
        applications,
        stats: {
          totalTests: await MockTestAttempt.countDocuments({ user: req.user._id }),
          totalApplications: await OpportunityApplication.countDocuments({ user: req.user._id })
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudyAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, analytics: {} });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUpcomingDeadlines = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, deadlines: [] });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// College Dashboard - For college administrators
export const getCollegeDashboard = async (req: AuthRequest, res: Response) => {
  try {
    // Mock data for college dashboard
    // In production, fetch real data from database
    const dashboardData = {
      totalStudents: 1250,
      activeCourses: 45,
      upcomingExams: 12,
      avgAttendance: 87,
      departments: [
        { name: 'Computer Science', students: 450, avgGrade: 'A-' },
        { name: 'Electronics', students: 380, avgGrade: 'B+' },
        { name: 'Mechanical', students: 320, avgGrade: 'B' },
        { name: 'Civil', students: 100, avgGrade: 'B+' }
      ],
      upcomingExamsList: [
        { title: 'Data Structures', subject: 'Computer Science', date: 'Dec 20, 2024', students: 150 },
        { title: 'Digital Electronics', subject: 'Electronics', date: 'Dec 22, 2024', students: 120 },
        { title: 'Thermodynamics', subject: 'Mechanical', date: 'Dec 25, 2024', students: 100 }
      ],
      alerts: [
        { type: 'warning', message: 'Library books overdue for 45 students', time: '2 hours ago' },
        { type: 'info', message: 'Semester registration closes in 3 days', time: '5 hours ago' }
      ],
      topPerformers: [
        { name: 'Rahul Sharma', grade: 'CGPA 9.8' },
        { name: 'Priya Verma', grade: 'CGPA 9.6' },
        { name: 'Amit Kumar', grade: 'CGPA 9.5' }
      ]
    };

    res.json(dashboardData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Office Dashboard - For placement office
export const getOfficeDashboard = async (req: AuthRequest, res: Response) => {
  try {
    // Mock data for office dashboard
    // In production, fetch real data from database
    const dashboardData = {
      activeOpportunities: 35,
      partnerCompanies: 120,
      totalApplications: 850,
      placements: 315,
      placementRate: 78,
      avgPackage: '6.5L',
      highestPackage: '42L',
      companies: 85,
      pendingApplications: 45,
      pendingInterviews: 18,
      recentOpportunities: [
        { title: 'Software Engineer', company: 'Google', type: 'Job', applicants: 45 },
        { title: 'Product Manager', company: 'Microsoft', type: 'Internship', applicants: 32 },
        { title: 'Data Analyst', company: 'Amazon', type: 'Job', applicants: 28 }
      ],
      partnerCompaniesList: [
        { name: 'Google', openings: 5 },
        { name: 'Microsoft', openings: 8 },
        { name: 'Amazon', openings: 6 },
        { name: 'Flipkart', openings: 4 },
        { name: 'Infosys', openings: 12 },
        { name: 'TCS', openings: 15 }
      ],
      upcomingDrives: [
        { company: 'Google', role: 'SDE-1', date: 'Dec 18', eligible: 120 },
        { company: 'Microsoft', role: 'PM Intern', date: 'Dec 20', eligible: 85 },
        { company: 'Amazon', role: 'Data Analyst', date: 'Dec 22', eligible: 95 }
      ],
      recentPlacements: [
        { name: 'Rajesh Kumar', company: 'Google', package: '28L' },
        { name: 'Sneha Patel', company: 'Microsoft', package: '24L' },
        { name: 'Vikram Singh', company: 'Amazon', package: '22L' }
      ]
    };

    res.json(dashboardData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayTasks = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, tasks: [] });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPerformanceStats = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, stats: {} });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
