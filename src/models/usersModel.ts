import format from 'pg-format';
import { pool } from '../db/pool.js';
import { BaseModel } from './baseModel.js';

interface UserType {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  is_member?: boolean;
  is_admin?: boolean;
}

class UserModel extends BaseModel<UserType> {
  protected messageTableName = 'messages';

  constructor() {
    super(pool, 'users');
  }

  async getAllMessages(userId: number): Promise<UserType[]> {
    const { rows } = await pool.query<UserType>(
      format(
        `
          SELECT
            *
          FROM
            %I
          WHERE
            user_id = $1
        `,
        this.messageTableName,
      ),
      [userId],
    );

    return rows;
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    const { rows } = await pool.query<UserType>(
      format(
        `
          SELECT
            *
          FROM
            %I
          WHERE
            username = $1
        `,
        this.tableName,
      ),
      [username],
    );

    return rows.at(0);
  }
}

export const usersModel = new UserModel();
export type { UserType };
