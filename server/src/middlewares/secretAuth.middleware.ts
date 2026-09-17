import { Request, Response, NextFunction } from "express";
import UrlModel from "../models/Url.model";
import { UnauthorizedError } from "../utils/errors";

/**
 * Middleware that authenticates update/delete requests using a per-URL secret key.
 *
 * The client sends the secret key in the `X-Secret-Key` request header.
 * The key is validated against the database. If it doesn't match, the request
 * is rejected with a 401 Unauthorized error.
 *
 * No login is required — each URL has its own unguessable secret key (~157 bits
 * of entropy via nanoid(32)) that is returned to the owner at creation time.
 */
export const requireSecretKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { shortCode } = req.params;
        const providedKey = req.header("X-Secret-Key");

        if (!providedKey) {
            throw new UnauthorizedError("Missing X-Secret-Key header");
        }

        const doc = await UrlModel.findOne({ shortCode });

        if (!doc) {
            throw new UnauthorizedError("Invalid or expired short URL");
        }

        if (doc.secretKey !== providedKey) {
            throw new UnauthorizedError("Invalid secret key");
        }

        next();
    } catch (error) {
        next(error);
    }
};
