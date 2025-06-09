import { defineConfig } from "drizzle-kit";

const dbPath = "../../data/db/sqlite-dev.db";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/config/drizzle/schemas/*",
  out: "./src/config/drizzle/migrations",
  dbCredentials: {
    url: dbPath,
  },
  verbose: true,
  strict: true,
});
