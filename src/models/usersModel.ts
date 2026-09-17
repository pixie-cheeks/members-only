import { pool } from '../db/pool.js';
import { BaseModel } from './baseModel.js';

interface UserType {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  is_member: boolean;
  is_admin: boolean;
}

export const usersModel = new BaseModel<UserType>(pool, 'users');
export type { UserType };
