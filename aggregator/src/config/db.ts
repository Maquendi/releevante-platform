import { resolve } from "path";

const dbPath = resolve(__dirname, "../../../ui-smartlib-web/sqlite-dev.db");

console.log("dbpath:  " + dbPath);

import Database from "better-sqlite3";

const database = new Database(dbPath, { verbose: console.log });
database.pragma("journal_mode = WAL");

export const dbConnection = database;
