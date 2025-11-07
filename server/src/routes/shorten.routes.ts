import express from 'express';
import { createShortUrl, deleteUrl, getOriginal, getStats, updateUrl } from '../controllers/shorten.controller';
import { createUrlLimiter, getUrlLimiter, modifyUrlLimiter } from '../middlewares/rateLimiter.middleware';

const shortenRouter = express.Router();

// Create new short URL - Rate limited to prevent abuse
shortenRouter.post('/', createUrlLimiter, createShortUrl);

// Get stats for a specific short URL (must come before generic /:shortCode route)
shortenRouter.get('/:shortCode/stats', getUrlLimiter, getStats);

// Get original URL and redirect - Most frequently used, moderate limits
shortenRouter.get('/:shortCode', getUrlLimiter, getOriginal);

// Update short URL - Stricter limits for modification operations
shortenRouter.put('/:shortCode', modifyUrlLimiter, updateUrl);

// Delete short URL - Stricter limits for modification operations
shortenRouter.delete('/:shortCode', modifyUrlLimiter, deleteUrl);


export default shortenRouter;
