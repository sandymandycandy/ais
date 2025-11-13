import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Opportunity, OpportunityApplication } from '../models/Opportunity';

export const createOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const opportunityData = { ...req.body, postedBy: req.user._id };
    const opportunity = await Opportunity.create(opportunityData);
    res.status(201).json({ success: true, opportunity });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOpportunities = async (req: Request, res: Response) => {
  try {
    const { type, domain, location } = req.query;
    const filter: any = { status: 'active' };
    if (type) filter.type = type;
    if (domain) filter.domain = { $in: [domain] };
    if (location) filter['location.city'] = location;

    const opportunities = await Opportunity.find(filter)
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, opportunities });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOpportunityById = async (req: Request, res: Response) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('postedBy', 'name email');
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

    opportunity.views += 1;
    await opportunity.save();

    res.json({ success: true, opportunity });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const applyToOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const { resume, coverLetter } = req.body;
    const application = await OpportunityApplication.create({
      opportunity: req.params.id,
      user: req.user._id,
      resume,
      coverLetter,
      statusHistory: [{ status: 'applied', date: new Date() }]
    });

    await Opportunity.findByIdAndUpdate(req.params.id, { $inc: { applications: 1 } });

    res.status(201).json({ success: true, application });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await OpportunityApplication.find({ user: req.user._id })
      .populate('opportunity', 'title company type applicationDeadline')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, notes } = req.body;
    const application = await OpportunityApplication.findById(req.params.applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    application.statusHistory.push({ status, date: new Date(), notes } as any);
    await application.save();

    res.json({ success: true, application });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const bookmarkOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    await Opportunity.findByIdAndUpdate(req.params.id, { $inc: { bookmarks: 1 } });
    res.json({ success: true, message: 'Opportunity bookmarked' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookmarks = async (req: AuthRequest, res: Response) => {
  try {
    // Implementation for fetching bookmarked opportunities
    res.json({ success: true, bookmarks: [] });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
