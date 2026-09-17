import * as z from 'zod';
import { parsedEnvironment } from './settings/parsedEnvironment.js';

const errorIsRequired = 'is required';

const userCreationSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .nonempty({ error: `First Name ${errorIsRequired}` }),
    last_name: z
      .string()
      .trim()
      .nonempty({ error: `Last Name ${errorIsRequired}` }),
    username: z
      .string()
      .trim()
      .nonempty({ error: `Username ${errorIsRequired}` }),
    password: z
      .string()
      .trim()
      .nonempty({ error: `Password ${errorIsRequired}` }),
    confirm_password: z
      .string()
      .trim()
      .nonempty({ error: `Confirm Password ${errorIsRequired}` }),
  })
  .superRefine(({ confirm_password, password }, context) => {
    if (confirm_password === password) return;

    context.addIssue({
      code: 'custom',
      message: 'The passwords did not match',
      path: ['confirm_password'],
    });
  });

const joinClubSchema = z.object({
  password: z
    .string()
    .trim()
    .nonempty({ error: `Password ${errorIsRequired}` })
    .refine((value) => value === parsedEnvironment.JOIN_CLUB_SECRET, {
      error: 'Incorrect club member password',
    }),
});

export { userCreationSchema, joinClubSchema };
