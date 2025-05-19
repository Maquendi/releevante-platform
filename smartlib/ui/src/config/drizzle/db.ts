import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schemas";

let database:
  | (BetterSQLite3Database<typeof schema> & {
      $client: Database.Database;
    })
  | null = null;

export const getDbConnection = (): BetterSQLite3Database<typeof schema> & {
  $client: Database.Database;
} => {
  if (!database) {
    if (!process.env.DB_PATH) {
      throw new Error("NEED TO SET DB_PATH environment variable");
    }

    const dbPath = process.env.DB_PATH;

    console.log(`CONNECTING TO DB IN LOCATION: ${dbPath}`);

    const sqlite = new Database(dbPath, { fileMustExist: true });

    sqlite.pragma("journal_mode = WAL");

    database = drizzle(sqlite, { schema });
  }

  return database;
};

export const db = new Proxy(
  {} as BetterSQLite3Database<typeof schema> & {
    $client: Database.Database;
  },
  {
    get: (target, prop) => {
      return getDbConnection()[
        prop as keyof (BetterSQLite3Database<typeof schema> & {
          $client: Database.Database;
        })
      ];
    },
  }
);
