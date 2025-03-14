import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schemas";
import path from "path";

const dbUrl = process.env.DB_PATH!;

const dbPath = path.resolve(__dirname, dbUrl);

const sqlite = new Database(dbPath);

export const db = drizzle({ client: sqlite, schema });
