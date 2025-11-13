import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  try {
    const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : undefined;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: avatarPath },
      { new: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { name, level } = req.body;
    const user = await User.findById(req.user._id);
    user!.skills.push({ name, level, endorsements: [] } as any);
    await user!.save();
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const endorseSkill = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, message: 'Skill endorsed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addAchievement = async (req: AuthRequest, res: Response) => {
  try {
    const achievement = req.body;
    const user = await User.findById(req.user._id);
    user!.achievements.push(achievement);
    await user!.save();
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addCertification = async (req: AuthRequest, res: Response) => {
  try {
    const certification = req.body;
    const user = await User.findById(req.user._id);
    user!.certifications.push(certification);
    await user!.save();
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadResume = async (req: AuthRequest, res: Response) => {
  try {
    const resumePath = req.file ? `/uploads/resumes/${req.file.filename}` : '';
    const { title } = req.body;
    const user = await User.findById(req.user._id);
    user!.resumes.push({ title, fileUrl: resumePath, uploadDate: new Date(), isPrimary: false } as any);
    await user!.save();
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
