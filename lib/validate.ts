import { z } from 'zod';


export const articlesQuerySchema = z.object({
    query: z.string().optional().transform(q => (q || '').trim()),
    sort: z.enum(['asc', 'desc']).optional().default('desc')
});


export type ArticlesQuery = z.infer<typeof articlesQuerySchema>;