import { defineConfig } from "drizzle-kit";
import path from "path";

const dbPath = path.resolve(__dirname, "../sqlite-dev.db");
console.log("Using database at:", dbPath);

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
