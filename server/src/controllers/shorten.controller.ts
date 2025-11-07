import { Request, Response, NextFunction } from 'express';
import { createUrlSchema } from '../schema/shorten.schema';
import { generateUniqueShortCode } from '../utils/generateShortCode';
import UrlModel from '../models/Url.model';


export const createShortUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = createUrlSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
        }
        const shortCode = await generateUniqueShortCode();
        const doc = await UrlModel.create({ url: parsed.data.url, shortCode })
        res.status(201).json(doc);
    } catch (error) {
        next(error);
    }
}

export const getOriginal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { shortCode } = req.body;
        const doc = await UrlModel.findOneAndUpdate(
            { shortCode },
            { $inc: { accessCount: 1 } },
            { new: true }
        )
        if (!doc) return res.status(404).json({ message: 'Short URL not found' });
        res.json(doc);
    } catch (error) {
        next(error);
    }
}