import { BaseModel } from '../models/baseModel.js';
import { messagesModel } from '../models/messagesModel.js';
import { usersModel } from '../models/usersModel.js';
import { pool } from './pool.js';

const delay = (delayInMS: number): Promise<undefined> =>
  new Promise((resolve) => {
    setTimeout(resolve, delayInMS);
  });

const tableOrderArray = [
  new BaseModel(pool, 'sessions'),
  usersModel,
  messagesModel,
];

const resetTables = (): Promise<undefined[]> =>
  Promise.all(tableOrderArray.map((table) => table.deleteAllRows()));

const dropTables = async (): Promise<void> => {
  for (const table of tableOrderArray) {
    // eslint-disable-next-line no-await-in-loop
    await table.dropTable();
  }
};

const seedTables = async (): Promise<void> => {
  await delay(100);
};

export { resetTables, seedTables, dropTables };
