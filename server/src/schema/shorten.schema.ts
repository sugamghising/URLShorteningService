import { z } from 'zod';

export const createUrlSchema = z.object({
    url: z.string().url('Invalid URL')
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;
