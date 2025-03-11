import { resolve } from "path";

const dbPath = resolve(__dirname, "../../../sqlite-dev.db");

import Database from "better-sqlite3";

const database = new Database(dbPath, { fileMustExist: true });
database.pragma("journal_mode = WAL");

export const dbConnection = database;
