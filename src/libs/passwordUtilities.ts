import bcrypt from 'bcryptjs';

const validatePassword = (password: string, hash: string): Promise<boolean> =>
  bcrypt.compare(password, hash);

const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, 10);

export { validatePassword, hashPassword };
