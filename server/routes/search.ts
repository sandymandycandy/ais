import express from 'express';
import { protect } from '../middleware/auth';
import { globalSearch, searchSuggestions, advancedSearch } from '../controllers/searchController';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Global search
router.get('/', globalSearch);

// Search suggestions
router.get('/suggestions', searchSuggestions);

// Advanced search with filters
router.get('/advanced', advancedSearch);

export default router;
