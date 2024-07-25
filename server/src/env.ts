import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
  CLIENT_BASE_URL: z.string().url(),
  CLIENT_PORT: z.coerce.number().default(5555),
})

export const env = envSchema.parse(process.env)