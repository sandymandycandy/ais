import express from 'express';
import { protect } from '../middleware/auth';
import { uploadSingle, uploadMultiple } from '../middleware/upload';
import {
  uploadAvatar,
  uploadNoteFile,
  uploadMultipleFiles,
  uploadProjectImage,
  deleteFile,
  getUploadSignature
} from '../controllers/uploadController';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Single file uploads
router.post('/avatar', uploadSingle, uploadAvatar);
router.post('/note', uploadSingle, uploadNoteFile);
router.post('/project-image', uploadSingle, uploadProjectImage);

// Multiple files upload
router.post('/multiple', uploadMultiple, uploadMultipleFiles);

// Delete file
router.delete('/delete', deleteFile);

// Get upload signature (for client-side uploads)
router.post('/signature', getUploadSignature);

export default router;
