import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import dotenv from 'dotenv'
import { env } from './config/env';
import { connectDb } from './config/db';
import shortenRouter from './routes/shorten.routes';
import { errorHandler, notFound } from './middlewares/error.middleware';
import { globalLimiter } from './middlewares/rateLimiter.middleware';

const app = express()
dotenv.config();

const PORT = env.PORT || 5000;

// Apply global rate limiter to all requests
app.use(globalLimiter);

app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (_req, res) => { res.send(`Hello from backend.`) })

// Health check endpoint - doesn't require DB connection
app.get('/health', async (_req, res) => {
    try {
        // Check database connection status
        await connectDb();
        res.json({ 
            ok: true, 
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({ 
            ok: false, 
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
});

// Lazy database connection middleware
// Connects to DB on first request instead of at module load time
app.use(async (_req, _res, next) => {
    try {
        await connectDb();
        next();
    } catch (error) {
        // If DB connection fails, pass to error handler instead of crashing
        next(error);
    }
});

app.use('/api/shorten', shortenRouter);

app.use(notFound);
app.use(errorHandler);

// Only start the server if not in serverless environment (Vercel)
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
    // For local development, connect immediately
    connectDb().catch((error) => {
        console.error('Failed to connect to database:', error);
        // In local dev, we can exit if DB connection fails
        if (process.env.NODE_ENV === 'development') {
            process.exit(1);
        }
    });
    
    app.listen(PORT, () => {
        console.log(`App listening to PORT ${PORT}`)
    })
}

// Export for Vercel serverless
export default app;