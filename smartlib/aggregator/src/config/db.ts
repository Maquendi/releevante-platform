import Database from "better-sqlite3";

let database: Database.Database | null = null;

/**
 * Gets the database connection, initializing it if it hasn't been initialized yet.
 * This lazy initialization ensures the database is only connected when needed.
 */
export const getDbConnection = (): Database.Database => {
  if (!database) {
    const dbPath = process.env.DB_PATH;
    console.log(`DATABASE LOCATION AT ${dbPath}`);

    database = new Database(dbPath, { fileMustExist: true });
    database.pragma("journal_mode = WAL");
  }

  return database;
};

// For backward compatibility with existing code
export const dbConnection = new Proxy({} as Database.Database, {
  get: (target, prop) => {
    return getDbConnection()[prop as keyof Database.Database];
  }
});
