import { z } from 'zod';

// Distinguish between server and client environment variables.
// Only expose NEXT_PUBLIC_* to the client bundle.

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MATOMO_URL: z.string().url().optional(),
  MATOMO_SITE_ID: z.string().optional(),
  // Add future server-only secrets here
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_NAME: z.string().default('NHL Explorer'),
  // Add other NEXT_PUBLIC_* vars here
});

const serverEnv = serverSchema.parse(process.env);
const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
});

export const env = { ...serverEnv, ...clientEnv } as const;

export type Env = typeof env;
