import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite", 
  schema: "./drizzle/schemas/*",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: "sqlite.db",
  },
  verbose: true,
  strict: true,
});
