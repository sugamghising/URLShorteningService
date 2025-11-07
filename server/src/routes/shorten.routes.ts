import express from 'express';
import { createShortUrl, deleteUrl, getOriginal, getStats, updateUrl } from '../controllers/shorten.controller';

const shortenRouter = express.Router();

shortenRouter.post('/', createShortUrl);
shortenRouter.get('/:shortCode', getOriginal);
shortenRouter.put('/:shortCode', updateUrl);
shortenRouter.delete('/:shortCode', deleteUrl);
shortenRouter.get('/:shortCode/stats', getStats);


export default shortenRouter;
