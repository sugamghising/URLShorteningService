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

app.use(cors({ origin: env.BASE_URL, credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (_req, res) => { res.send(`Hello from backend.`) })

app.use('/api/shorten', shortenRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use(notFound);
app.use(errorHandler);

connectDb();
app.listen(PORT, () => {
    console.log(`App listening to PORT ${PORT}`)
})
