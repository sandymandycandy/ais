import { Request, Response } from 'express';
import {
  uploadToCloudinary,
  uploadProfilePicture,
  uploadDocument,
  uploadNoteImage,
  deleteFromCloudinary
} from '../utils/cloudinary';
import User from '../models/User';

/**
 * Upload profile picture
 */
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = (req as any).user.userId;

    // Upload to Cloudinary
    const result = await uploadProfilePicture(req.file.buffer);

    // Update user profile
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.secure_url },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile picture uploaded successfully',
      url: result.secure_url,
      user
    });
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: error.message || 'Error uploading file' });
  }
};

/**
 * Upload note document/image
 */
export const uploadNoteFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const isImage = req.file.mimetype.startsWith('image/');

    let result;
    if (isImage) {
      result = await uploadNoteImage(req.file.buffer);
    } else {
      result = await uploadDocument(req.file.buffer, 'student-hub/notes');
    }

    res.json({
      message: 'File uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
      size: result.bytes
    });
  } catch (error: any) {
    console.error('Error uploading note file:', error);
    res.status(500).json({ message: error.message || 'Error uploading file' });
  }
};

/**
 * Upload multiple files
 */
export const uploadMultipleFiles = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const folder = req.body.folder || 'student-hub/misc';

    const uploadPromises = req.files.map(file => {
      const isImage = file.mimetype.startsWith('image/');
      const resourceType = isImage ? 'image' : 'raw';
      return uploadToCloudinary(file.buffer, folder, resourceType);
    });

    const results = await Promise.all(uploadPromises);

    res.json({
      message: 'Files uploaded successfully',
      files: results.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        resourceType: result.resource_type,
        size: result.bytes
      }))
    });
  } catch (error: any) {
    console.error('Error uploading multiple files:', error);
    res.status(500).json({ message: error.message || 'Error uploading files' });
  }
};

/**
 * Upload project image
 */
export const uploadProjectImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      'student-hub/projects',
      'image'
    );

    res.json({
      message: 'Project image uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error: any) {
    console.error('Error uploading project image:', error);
    res.status(500).json({ message: error.message || 'Error uploading file' });
  }
};

/**
 * Delete file from Cloudinary
 */
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { publicId, resourceType } = req.body;

    if (!publicId) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    await deleteFromCloudinary(publicId, resourceType || 'image');

    res.json({ message: 'File deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: error.message || 'Error deleting file' });
  }
};

/**
 * Get upload signature for client-side uploads
 */
export const getUploadSignature = async (req: Request, res: Response) => {
  try {
    const { folder } = req.body;
    const timestamp = Math.round(new Date().getTime() / 1000);

    // This would require cloudinary SDK to generate signature
    // For now, we'll use server-side uploads only

    res.json({
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: folder || 'student-hub'
    });
  } catch (error: any) {
    console.error('Error generating upload signature:', error);
    res.status(500).json({ message: error.message || 'Error generating signature' });
  }
};
