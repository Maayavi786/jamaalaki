import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

// Define environment variables schema
const envSchema = z.object({
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
});

// Validate and export environment variables
export const env = envSchema.parse(process.env);
