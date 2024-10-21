import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite", 
  schema: "./src/config/drizzle/schemas/*",
  out: "./src/config/drizzle/migrations",
  dbCredentials: {
    url: "sqlite.db",
  },
  verbose: true,
  strict: true,
});
