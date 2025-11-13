import express from 'express';
import { protect, optionalAuth } from '../middleware/auth';
import multer from 'multer';

const upload = multer({ dest: 'uploads/notes/' });

const router = express.Router();

// Import controller functions (to be created)
import {
  uploadNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  rateNote,
  generateSummary,
  generateFlashcards,
  askClarityBot,
  searchNotes
} from '../controllers/noteController';

router.post('/', protect, upload.single('file'), uploadNote);
router.get('/', optionalAuth, getNotes);
router.get('/search', optionalAuth, searchNotes);
router.get('/:id', optionalAuth, getNoteById);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);
router.post('/:id/rate', protect, rateNote);
router.post('/:id/summary', protect, generateSummary);
router.post('/:id/flashcards', protect, generateFlashcards);
router.post('/clarity-bot', protect, askClarityBot);

export default router;
