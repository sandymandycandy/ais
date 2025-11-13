import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MockTest, MockTestAttempt } from '../models/MockTest';

export const createMockTest = async (req: AuthRequest, res: Response) => {
  try {
    const testData = { ...req.body, createdBy: req.user._id };
    const test = await MockTest.create(testData);
    res.status(201).json({ success: true, test });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMockTests = async (req: Request, res: Response) => {
  try {
    const tests = await MockTest.find({ status: 'published', isPublic: true })
      .populate('exam', 'name fullName')
      .populate('createdBy', 'name');
    res.json({ success: true, tests });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMockTestById = async (req: Request, res: Response) => {
  try {
    const test = await MockTest.findById(req.params.id)
      .populate('exam', 'name fullName');
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json({ success: true, test });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const startTest = async (req: AuthRequest, res: Response) => {
  try {
    const test = await MockTest.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });

    const attempt = await MockTestAttempt.create({
      test: test._id,
      user: req.user._id,
      startTime: new Date(),
      totalMarks: test.totalMarks,
      answers: [],
      status: 'ongoing'
    });

    res.json({ success: true, attempt });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { attemptId, questionIndex, selectedOption } = req.body;
    const attempt = await MockTestAttempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ message: 'Attempt not found' });

    // Logic to update answer
    res.json({ success: true, message: 'Answer submitted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitTest = async (req: AuthRequest, res: Response) => {
  try {
    const attempt = await MockTestAttempt.findById(req.body.attemptId).populate('test');
    if (!attempt) return res.status(404).json({ message: 'Attempt not found' });

    attempt.endTime = new Date();
    attempt.status = 'completed';
    // Calculate score and analytics
    await attempt.save();

    res.json({ success: true, attempt });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTestResults = async (req: AuthRequest, res: Response) => {
  try {
    const attempt = await MockTestAttempt.findById(req.params.attemptId)
      .populate('test')
      .populate('user', 'name');
    if (!attempt) return res.status(404).json({ message: 'Attempt not found' });
    res.json({ success: true, attempt });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAttempts = async (req: AuthRequest, res: Response) => {
  try {
    const attempts = await MockTestAttempt.find({ user: req.user._id })
      .populate('test', 'title exam')
      .sort({ createdAt: -1 });
    res.json({ success: true, attempts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const leaderboard = await MockTestAttempt.find({ test: req.params.id, status: 'completed' })
      .populate('user', 'name profilePicture college')
      .sort({ score: -1 })
      .limit(100);
    res.json({ success: true, leaderboard });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
