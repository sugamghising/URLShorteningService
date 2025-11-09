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

// CORS configuration - must be before rate limiter to handle preflight requests
// When credentials: true, origin cannot be '*', must be specific origin or function
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
            return callback(null, true);
        }

        // If CLIENT_ORIGIN is '*', allow all origins (but can't use credentials)
        if (env.CLIENT_ORIGIN === '*') {
            return callback(null, true);
        }

        // Check if origin is in allowed list (support multiple origins)
        const allowedOrigins = env.CLIENT_ORIGIN.split(',').map(o => o.trim());
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: env.CLIENT_ORIGIN !== '*', // Only allow credentials if not using wildcard
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

// Apply global rate limiter to all requests (after CORS)
app.use(globalLimiter);

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

// Connect to database on app initialization (serverless will cache this)
connectDb().catch((error) => {
    console.error('Initial database connection failed:', error);
    // Don't exit in serverless, let requests handle connection errors
});

// Database connection middleware - ensures DB is connected before processing routes
app.use('/api/shorten', async (_req, _res, next) => {
    try {
        await connectDb();
        next();
    } catch (error) {
        // Pass database errors to error handler
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