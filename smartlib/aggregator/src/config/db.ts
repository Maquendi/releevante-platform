import { resolve } from "path";

import Database from "better-sqlite3";

const dbPath = resolve(__dirname, "../../../sqlite-dev.db");

console.log(`DATABASE LOCATION AT ${dbPath}`)

const database = new Database(dbPath, { fileMustExist: true });
database.pragma("journal_mode = WAL");

export const dbConnection = database;
