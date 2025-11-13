import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SkillCourse, CourseEnrollment } from '../models/SkillCourse';

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await SkillCourse.find({ status: 'published' });
    res.json({ success: true, courses });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await SkillCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ success: true, course });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    const enrollment = await CourseEnrollment.create({
      user: req.user._id,
      course: req.params.id
    });
    await SkillCourse.findByIdAndUpdate(req.params.id, { $inc: { enrolledStudents: 1 } });
    res.status(201).json({ success: true, enrollment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await CourseEnrollment.find({ user: req.user._id })
      .populate('course', 'title thumbnail difficulty');
    res.json({ success: true, enrollments });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markLessonComplete = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, message: 'Lesson marked complete' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitProject = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, message: 'Project submitted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rateCourse = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, message: 'Course rated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
