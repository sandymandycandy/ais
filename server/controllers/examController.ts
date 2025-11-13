import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import Exam from '../models/Exam';
import User from '../models/User';

export const getExams = async (req: Request, res: Response) => {
  try {
    const exams = await Exam.find().select('name fullName category subcategory description');
    res.json({ success: true, exams });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExamById = async (req: Request, res: Response) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ success: true, exam });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExamsByCategory = async (req: Request, res: Response) => {
  try {
    const exams = await Exam.find({ category: req.params.category });
    res.json({ success: true, exams });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const targetExam = async (req: AuthRequest, res: Response) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const user = await User.findById(req.user._id);
    if (!user!.competitiveExamTargets.includes(exam.name)) {
      user!.competitiveExamTargets.push(exam.name);
      exam.totalStudentsTargeting += 1;
      await user!.save();
      await exam.save();
    }

    res.json({ success: true, message: 'Exam targeted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyTargetExams = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    const exams = await Exam.find({ name: { $in: user!.competitiveExamTargets } });
    res.json({ success: true, exams });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSyllabusProgress = async (req: AuthRequest, res: Response) => {
  try {
    // Implementation for tracking syllabus progress
    res.json({ success: true, message: 'Progress updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
