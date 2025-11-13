import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import Note from '../models/Note';

export const uploadNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, subject, topic } = req.body;
    const filePath = req.file ? `/uploads/notes/${req.file.filename}` : '';
    const note = await Note.create({
      title,
      subject,
      topic,
      uploadedBy: req.user._id,
      fileUrl: filePath,
      fileName: req.file?.originalname || '',
      fileType: 'pdf',
      fileSize: req.file?.size || 0
    });
    res.status(201).json({ success: true, note });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ status: 'active' }).populate('uploadedBy', 'name profilePicture');
    res.json({ success: true, notes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id).populate('uploadedBy', 'name profilePicture');
    if (!note) return res.status(404).json({ message: 'Note not found' });
    note.views += 1;
    await note.save();
    res.json({ success: true, note });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, note });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    await Note.findByIdAndUpdate(req.params.id, { status: 'deleted' });
    res.json({ success: true, message: 'Note deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, review } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    note.ratings.push({ user: req.user._id, rating, review, date: new Date() } as any);
    note.averageRating = note.ratings.reduce((acc, r) => acc + r.rating, 0) / note.ratings.length;
    await note.save();
    res.json({ success: true, note });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const generateSummary = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    // AI summary generation will be implemented with OpenAI
    note.aiSummary = 'AI-generated summary will appear here';
    await note.save();
    res.json({ success: true, summary: note.aiSummary });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const generateFlashcards = async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, flashcards: [] });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const askClarityBot = async (req: AuthRequest, res: Response) => {
  try {
    const { question } = req.body;
    res.json({ success: true, answer: 'AI bot response will appear here' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const searchNotes = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const notes = await Note.find({ 
      $text: { $search: q as string },
      status: 'active' 
    }).populate('uploadedBy', 'name profilePicture');
    res.json({ success: true, notes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
