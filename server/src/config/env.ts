import 'dotenv/config';
import { z } from 'zod';

/**
 * Environment variable schema using Zod for validation
 */
const envSchema = z.object({
    PORT: z.string().default('5000').transform(val => val || '5000'),
    MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
    CLIENT_ORIGIN: z.string().default('*'),
    BASE_URL: z.string().optional(),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
});

/**
 * Validates environment variables at startup
 * Exits the process if validation fails
 */
function validateEnv() {
    try {
        const parsed = envSchema.parse({
            PORT: process.env.PORT,
            MONGODB_URI: process.env.MONGODB_URI,
            CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
            BASE_URL: process.env.BASE_URL,
            NODE_ENV: process.env.NODE_ENV
        });

        return {
            PORT: parsed.PORT,
            MONGODB_URI: parsed.MONGODB_URI,
            CLIENT_ORIGIN: parsed.CLIENT_ORIGIN,
            BASE_URL: parsed.BASE_URL ?? `http://localhost:${parsed.PORT}`,
            NODE_ENV: parsed.NODE_ENV
        };
    } catch (error) {
        console.error('❌ Invalid environment variables:');
        if (error instanceof z.ZodError) {
            error.issues.forEach((issue) => {
                console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
            });
        }
        console.error('\nPlease check your .env file and ensure all required variables are set.');
        process.exit(1);
    }
}

export const env = validateEnv();
