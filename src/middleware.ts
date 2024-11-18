import { authMiddleware } from './middleware/auth';
import { sequence } from 'astro:middleware';

export const onRequest = sequence(authMiddleware); 