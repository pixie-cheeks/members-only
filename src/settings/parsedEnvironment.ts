import 'dotenv/config';
import * as z from 'zod';

const commonShape = z.object({
  PORT: z.string().nonempty('PORT is required!').transform(Number),
  SESSION_SECRET: z.string().nonempty('SESSION_SECRET is required!'),
  JOIN_CLUB_SECRET: z.string().nonempty('JOIN_CLUB_SECRET is required!'),
  BECOME_ADMIN_SECRET: z.string().nonempty('BECOME_ADMIN_SECRET is required!'),
}).shape;

const environmentSchema = z.union([
  z.object({
    DB_ENV: z.literal('dev'),
    CONNECTION_STRING: z.string().nonempty('CONNECTION_STRING is required!'),
    ...commonShape,
  }),
  z.object({
    DB_ENV: z.literal('prod'),
    AIVEN_PROJECT_NAME: z.string().nonempty(),
    AIVEN_SERVICE_NAME: z.string().nonempty(),
    AIVEN_DB_NAME: z.string().nonempty(),
    AIVEN_TOKEN: z.string().nonempty(),
    DB_SSL_CA: z.string().nonempty(),
    ...commonShape,
  }),
]);

export const parsedEnvironment = environmentSchema.parse(process.env);
