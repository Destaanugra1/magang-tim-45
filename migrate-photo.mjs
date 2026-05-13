import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => l.split("=").map((p) => p.trim())),
);

const { default: postgres } = await import("postgres");
const sql = postgres(env.DATABASE_URL, { ssl: "require" });

try {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS photo_url text`;
  console.log("✓ photo_url column added (or already exists)");
} catch (e) {
  console.error("Error:", e.message);
  process.exit(1);
} finally {
  await sql.end();
}
