import express from 'express';
import { createShortUrl, deleteUrl, getOriginal, getStats, updateUrl } from '../controllers/shorten.controller';
import { createUrlLimiter, getUrlLimiter, modifyUrlLimiter } from '../middlewares/rateLimiter.middleware';
import { requireSecretKey } from '../middlewares/secretAuth.middleware';

const shortenRouter = express.Router();

// Create new short URL - Rate limited to prevent abuse
shortenRouter.post('/', createUrlLimiter, createShortUrl);

// Get stats for a specific short URL (must come before generic /:shortCode route)
shortenRouter.get('/:shortCode/stats', getUrlLimiter, getStats);

// Get original URL and redirect - Most frequently used, moderate limits
shortenRouter.get('/:shortCode', getUrlLimiter, getOriginal);

// Update short URL - Requires secret key, stricter limits for modification operations
shortenRouter.put('/:shortCode', modifyUrlLimiter, requireSecretKey, updateUrl);

// Delete short URL - Requires secret key, stricter limits for modification operations
shortenRouter.delete('/:shortCode', modifyUrlLimiter, requireSecretKey, deleteUrl);


export default shortenRouter;
