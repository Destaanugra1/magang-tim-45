import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env" });

const client = postgres(process.env.DATABASE_URL!, { max: 1 });

async function main() {
  // 1. Recreate categories table with ownerId
  console.log("Dropping old categories table (if exists)...");
  await client`DROP TABLE IF EXISTS "categories" CASCADE`;

  console.log("Creating categories table with ownerId...");
  await client`
    CREATE TABLE "categories" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "owner_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "name" text NOT NULL,
      "slug" text NOT NULL,
      "description" text,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "categories_owner_name_unique" UNIQUE("owner_id", "name")
    )
  `;
  console.log("✓ categories table created.");

  // 2. Verify
  const cols = await client`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'categories'
    ORDER BY ordinal_position
  `;
  console.log("Columns:", cols.map((c) => c.column_name).join(", "));

  await client.end();
}

main().catch(async (err) => {
  console.error("Failed:", err);
  await client.end();
  process.exit(1);
});
