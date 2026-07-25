import "dotenv/config";
import { defineConfig } from "prisma/config";

// CLI-only config: `prisma migrate`, `prisma db push`, `prisma studio`. The
// running app never reads this — it connects through the driver adapter in
// lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations need Supabase's direct connection (port 5432). The pooled
    // URL the app uses can't run the statements Prisma Migrate issues, so
    // fall back to it only when there's no direct URL to be had.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
