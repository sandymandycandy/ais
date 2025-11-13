import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Mentor, MentorSession } from '../models/Mentor';

export const applyAsMentor = async (req: AuthRequest, res: Response) => {
  try {
    const mentorData = { ...req.body, user: req.user._id };
    const mentor = await Mentor.create(mentorData);
    res.status(201).json({ success: true, mentor });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMentors = async (req: Request, res: Response) => {
  try {
    const mentors = await Mentor.find({ status: 'active', verified: true })
      .populate('user', 'name profilePicture email');
    res.json({ success: true, mentors });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMentorById = async (req: Request, res: Response) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('user', 'name profilePicture email college');
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
    res.json({ success: true, mentor });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const bookSession = async (req: AuthRequest, res: Response) => {
  try {
    const sessionData = { ...req.body, mentor: req.params.id, student: req.user._id };
    const session = await MentorSession.create(sessionData);
    res.status(201).json({ success: true, session });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMySessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await MentorSession.find({ 
      $or: [{ mentor: req.user._id }, { student: req.user._id }]
    }).populate('mentor student', 'name profilePicture');
    res.json({ success: true, sessions });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rateSession = async (req: AuthRequest, res: Response) => {
  try {
    const { rating } = req.body;
    const session = await MentorSession.findByIdAndUpdate(
      req.params.sessionId,
      { studentRating: rating },
      { new: true }
    );
    res.json({ success: true, session });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMentorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const mentor = await Mentor.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    );
    res.json({ success: true, mentor });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMentorAvailability = async (req: Request, res: Response) => {
  try {
    const mentor = await Mentor.findById(req.params.id).select('availability');
    res.json({ success: true, availability: mentor?.availability });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
