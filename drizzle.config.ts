import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./code/backend/drizzle/schema.ts",
  out: "./code/backend/drizzle/migrations",
  dbCredentials: {
    url: process.env["DATABASE_URL"] ?? "",
  },
});
