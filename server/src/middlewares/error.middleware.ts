import { Request, Response, NextFunction } from "express"

export const notFound = async (_req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    console.error(err);
    if (res.headersSent) return;
    res.status(500).json({ message: 'Internal Server Error' });
}