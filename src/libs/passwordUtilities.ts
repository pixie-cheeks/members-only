import bcrypt from 'bcryptjs';

const validatePassword = (
  storedPassword: string,
  givenPassword: string,
): Promise<boolean> => bcrypt.compare(storedPassword, givenPassword);

const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, 10);

export { validatePassword, hashPassword };
