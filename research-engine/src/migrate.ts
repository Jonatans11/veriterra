// ---------------------------------------------------------------------------
// Veriterra.AI — Database Migration Script
// ---------------------------------------------------------------------------
// Run via: `bun run migrate` or `node dist/migrate.js`
// Executes CREATE TABLE statements via the team-db CLI.
// ---------------------------------------------------------------------------

import { CREATE_TABLES_SQL } from "./schema.js";
import { execSync } from "child_process";

function run(): void {
  console.log("🔬 Veriterra.AI — Database Migration");
  console.log(`   Creating ${CREATE_TABLES_SQL.length} tables/indices...\n`);

  for (const sql of CREATE_TABLES_SQL) {
    try {
      // Escape single quotes inside the SQL for the shell
      const escaped = sql.replace(/'/g, "'\\''");
      const cmd = `team-db '${escaped}'`;
      execSync(cmd, { stdio: "pipe", timeout: 10000 });
      // Extract table name for display
      const match = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
      const name = match ? match[1] : "(index)";
      console.log(`   ✅ ${name}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`   ❌ Error: ${message}`);
    }
  }

  console.log("\n✅ Migration complete.");
}

run();