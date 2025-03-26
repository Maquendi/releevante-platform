import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schemas";

const databaseLocation = process.env.DB_PATH;

if (!databaseLocation) {
  throw new Error("NEED TO SET DBPATH env variable");
}

console.log(`CONNECTING TO DB IN LOCATION: ${databaseLocation}`);

const sqlite = new Database(databaseLocation);

export const db = drizzle({ client: sqlite, schema });
