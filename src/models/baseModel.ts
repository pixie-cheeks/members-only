import type { Pool } from 'pg';
import format from 'pg-format';

interface BaseType {
  id: number;
}

class BaseModel<RowType extends BaseType> {
  protected tableName: string;
  protected pool: Pool;

  constructor(pool: Pool, tableName: string) {
    this.pool = pool;
    this.tableName = tableName;
  }

  async dropTable(): Promise<undefined> {
    await this.pool.query(format(`DROP TABLE IF EXISTS %I;`, this.tableName));
  }

  async insertRow(data: Omit<RowType, 'id'>): Promise<RowType> {
    const columns = Object.keys(data);
    const values = Object.values(data);

    const { rows } = await this.pool.query<RowType>(
      format(
        `
          INSERT INTO
            %I (%I)
          VALUES
            (%L)
          RETURNING
            *;
        `,
        this.tableName,
        columns,
        values,
      ),
    );

    const insertedRow = rows.at(0);

    if (!insertedRow) throw new Error('Failed to insert row into table.');

    return insertedRow;
  }

  async editRowById(
    userId: number,
    newData: Partial<Omit<RowType, 'id'>>,
  ): Promise<RowType | undefined> {
    const entries = Object.entries(newData);

    const { rows } = await this.pool.query<RowType>(
      /* sql */ `
        UPDATE ${this.tableName}
        SET
          ${entries.map((columnRow) => columnRow.join(' = ')).join(', ')}
        WHERE
          id = $1
        RETURNING
          *;
      `,
      [userId],
    );

    return rows.at(0);
  }

  async getAllRows(): Promise<RowType[]> {
    const { rows } = await this.pool.query<RowType>(
      format(
        `
          SELECT
            *
          FROM
            %I;
        `,
        this.tableName,
      ),
    );
    return rows;
  }

  async getRowById(id: number): Promise<RowType | undefined> {
    const { rows } = await this.pool.query<RowType>(
      format(
        `
          SELECT
            *
          FROM
            %I
          WHERE
            id = $1;
        `,
        this.tableName,
      ),
      [id],
    );
    return rows.at(0);
  }

  async deleteRowById(id: number): Promise<void> {
    await this.pool.query(
      format(
        `
          DELETE FROM %I
          WHERE
            id = $1;
        `,
        this.tableName,
      ),
      [id],
    );
  }

  async deleteAllRows(): Promise<undefined> {
    await this.pool.query(format(`DELETE FROM %I;`, this.tableName));
  }
}

export { BaseModel };
