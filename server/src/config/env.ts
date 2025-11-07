import 'dotenv/config';

export const env = {
    PORT: process.env.PORT ?? '5000',
    MONGODB_URI: process.env.MONGODB_URI as string,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? '*',
    BASE_URL: process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 5000}`
};
