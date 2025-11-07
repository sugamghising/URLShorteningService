import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import dotenv from 'dotenv'
import { env } from './config/env';
import { connectDb } from './config/db';

const app = express()
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: env.BASE_URL, credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => { res.send(`Hello from backend.`) })

connectDb();
app.listen(PORT, () => {
    console.log(`App listening to PORT ${PORT}`)
})
