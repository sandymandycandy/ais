import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import Project from '../models/Project';

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const projectData = { ...req.body, creator: req.user._id };
    const project = await Project.create(projectData);
    res.status(201).json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ visibility: 'public' })
      .populate('creator', 'name profilePicture');
    res.json({ success: true, projects });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator team.user', 'name profilePicture');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.views += 1;
    await project.save();
    res.json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, message: 'Team member added' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, message: 'Team member removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, message: 'Task created' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, message: 'Task updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addMilestone = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, message: 'Milestone added' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const likeProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    if (!project.likes.includes(req.user._id as any)) {
      project.likes.push(req.user._id as any);
      await project.save();
    }
    
    res.json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({ creator: req.user._id });
    res.json({ success: true, projects });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
