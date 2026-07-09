// ---------------------------------------------------------------------------
// Veriterra.AI — Database Access Layer (team-db CLI wrapper)
// ---------------------------------------------------------------------------
// Wraps the team-db CLI for server-side use inside TanStack Start's
// createServerFn() handlers and API routes.
//
// Usage (server-only):
//   import { sql } from "~/db/db";
//   const rows = sql("SELECT * FROM products LIMIT 10");
// ---------------------------------------------------------------------------

import { execSync } from "node:child_process";

/**
 * Execute a SQL statement against the shared Turso database via the team-db CLI.
 * Returns parsed JSON rows.
 *
 * @param sqlStatement — A single SQL statement to execute.
 * @param options — Optional timeout and label for debugging.
 * @returns Array of result rows (empty array for INSERT/UPDATE/DELETE).
 */
export function sql<T extends Record<string, unknown> = Record<string, unknown>>(
  sqlStatement: string,
  options?: { timeout?: number; label?: string },
): T[] {
  const timeout = options?.timeout ?? 15_000;
  const label = options?.label ?? "db";

  try {
    // Escape single quotes for the shell: replace ' with '\''
    const escaped = sqlStatement.replace(/'/g, "'\\''");
    const output = execSync(`team-db '${escaped}'`, {
      encoding: "utf-8",
      timeout,
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });

    const trimmed = output.trim();
    if (!trimmed) return [];

    return JSON.parse(trimmed) as T[];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`[${label}] Database query failed: ${message}`);
  }
}

/**
 * Execute a write query (INSERT/UPDATE/DELETE) and discard results.
 * Useful for mutations where you don't need the return value.
 */
export function execute(
  sqlStatement: string,
  options?: { timeout?: number; label?: string },
): void {
  sql(sqlStatement, options);
}

/**
 * Escape a string value for safe SQL insertion (single-quote escaping).
 * Use this for user-supplied values to prevent SQL injection.
 */
export function escape(val: string): string {
  return val.replace(/'/g, "''");
}

/**
 * Format a UUID for use in SQL (wraps in single quotes).
 */
export function uuidToSql(uuid: string): string {
  return `'${escape(uuid)}'`;
}