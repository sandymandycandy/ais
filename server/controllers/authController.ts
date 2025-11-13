import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, college, course, year } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      college,
      course,
      year,
      profileCompleteness: 30 // Basic info filled
    });

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        year: user.year,
        profilePicture: user.profilePicture,
        level: user.level,
        xp: user.xp,
        coins: user.coins
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update login streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastLoginDate = user.streaks.login.lastDate ? new Date(user.streaks.login.lastDate) : null;

    if (lastLoginDate) {
      lastLoginDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        // Consecutive day
        user.streaks.login.current += 1;
        if (user.streaks.login.current > user.streaks.login.longest) {
          user.streaks.login.longest = user.streaks.login.current;
        }
        user.coins += 10; // Daily bonus
      } else if (daysDiff > 1) {
        // Streak broken
        user.streaks.login.current = 1;
      }
    } else {
      user.streaks.login.current = 1;
    }

    user.streaks.login.lastDate = new Date();
    user.lastActive = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        year: user.year,
        profilePicture: user.profilePicture,
        level: user.level,
        xp: user.xp,
        coins: user.coins,
        streaks: user.streaks
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('badges', 'name icon color category');

    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In production, send email with reset link
    // For now, just return success
    res.json({
      success: true,
      message: 'Password reset instructions sent to email'
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params;

    // In production, verify reset token
    // For now, just return success
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
