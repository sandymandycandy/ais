import multer from 'multer';
import path from 'path';

// Configure multer for memory storage (will upload to Cloudinary directly)
const storage = multer.memoryStorage();

// File filter to accept specific file types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file extensions
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|md/;
  const allowedFileTypes = new RegExp(`${allowedImageTypes.source}|${allowedDocTypes.source}`);

  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.match(/^(image|application)\//);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and documents are allowed!'));
  }
};

// Configure upload limits
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB max file size
};

// Create multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits
});

// Single file upload
export const uploadSingle = upload.single('file');

// Multiple files upload (max 5)
export const uploadMultiple = upload.array('files', 5);

// Fields upload for different types
export const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'document', maxCount: 1 },
  { name: 'avatar', maxCount: 1 }
]);
