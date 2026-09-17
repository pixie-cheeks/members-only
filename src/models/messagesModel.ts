import { pool } from '../db/pool.js';
import { BaseModel } from './baseModel.js';

interface MessageType {
  id: number;
  title: string;
  content: string;
  timestamp: Date;
  user_id: number;
}

interface UserMessageJoin {
  user_id: number;
  message_id: number;
  title: string;
  content: string;
  timestamp: Date;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  is_member: boolean;
  is_admin: boolean;
}

class MessageModel extends BaseModel<MessageType> {
  protected userTableName = 'users';

  constructor() {
    super(pool, 'messages');
  }

  async getRowByIdWithUser(
    messageId: number,
  ): Promise<UserMessageJoin | undefined> {
    const { rows } = await this.pool.query<UserMessageJoin>(
      /* sql */ `
        SELECT
          users.id AS user_id,
          messages.id AS message_id,
          messages.title,
          messages.content,
          messages.timestamp,
          users.first_name,
          users.last_name,
          users.username,
          users.password,
          users.is_member,
          users.is_admin,
        FROM
          users,
          messages
        WHERE
          users.id = messages.user_id
          AND messages.id = $1
      `,
      [messageId],
    );

    return rows.at(0);
  }
}

export const usersModel = new MessageModel();
export type { MessageType };
