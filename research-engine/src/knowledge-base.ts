// ---------------------------------------------------------------------------
// Veriterra.AI — Knowledge Base (Research Portal)
// ---------------------------------------------------------------------------
// The shared research report cache. First request for a product/ingredient
// triggers live research (or marks it as pending); all subsequent requests
// read the cached report. Reports carry a clearly separate "AI Research Rating"
// that never touches the deterministic scoring engine.
// ---------------------------------------------------------------------------

import type { ResearchReport, ReportStatus } from "./types.js";
import { execSync } from "child_process";

// ── Database interaction helpers ───────────────────────────────────────────
// These call team-db CLI to read/write the research_reports table.
// In production these would use a proper database driver.

/**
 * Execute a SQL statement via the team-db CLI and return parsed JSON.
 */
function dbQuery(sql: string): unknown[] {
  const escaped = sql.replace(/'/g, "'\\''");
  const output = execSync(`team-db '${escaped}'`, {
    encoding: "utf-8",
    timeout: 15000,
  });
  return JSON.parse(output) as unknown[];
}

/**
 * Get or create a research report. If none exists, creates one with status "pending".
 */
export function getOrCreateReport(
  targetType: "product" | "ingredient",
  targetId: string,
): ResearchReport {
  const rows = dbQuery(
    `SELECT * FROM research_reports WHERE target_type = '${targetType}' AND target_id = '${targetId}'`,
  );

  if (rows.length > 0) {
    // Increment view count
    const report = rows[0] as Record<string, unknown>;
    dbQuery(
      `UPDATE research_reports SET view_count = view_count + 1, updated_at = datetime('now') WHERE id = '${report.id}'`,
    );
    return mapRowToReport(report);
  }

  // Create new pending report
  const uuid = crypto.randomUUID();
  const now = new Date().toISOString();
  dbQuery(
    `INSERT INTO research_reports (id, target_type, target_id, status, view_count, created_at, updated_at) ` +
      `VALUES ('${uuid}', '${targetType}', '${targetId}', 'pending', 0, '${now}', '${now}')`,
  );

  return {
    id: uuid,
    targetType,
    targetId,
    status: "pending",
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Get a report by ID. Returns null if not found.
 */
export function getReport(reportId: string): ResearchReport | null {
  const rows = dbQuery(
    `SELECT * FROM research_reports WHERE id = '${reportId}'`,
  );
  if (rows.length === 0) return null;
  return mapRowToReport(rows[0] as Record<string, unknown>);
}

/**
 * Update a research report with completed content.
 */
export function completeReport(
  reportId: string,
  data: {
    aiSummary: string;
    aiKeyFindings: string[];
    aiEstimatedEfficacy: number;
    aiResearchNotes: string;
    sourceUrls: string[];
    expiresAt: string;
  },
): void {
  const now = new Date().toISOString();
  const keyFindingsJson = JSON.stringify(data.aiKeyFindings);
  const generatedAt = now;

  dbQuery(
    `UPDATE research_reports SET ` +
      `status = 'completed', ` +
      `ai_summary = '${escapeSql(data.aiSummary)}', ` +
      `ai_key_findings = '${escapeSql(keyFindingsJson)}', ` +
      `ai_estimated_efficacy = ${data.aiEstimatedEfficacy}, ` +
      `ai_research_notes = '${escapeSql(data.aiResearchNotes)}', ` +
      `generated_at = '${generatedAt}', ` +
      `expires_at = '${data.expiresAt}', ` +
      `updated_at = '${now}' ` +
      `WHERE id = '${reportId}'`,
  );

  // Insert source URLs
  for (const url of data.sourceUrls) {
    dbQuery(
      `INSERT OR IGNORE INTO report_source_urls (report_id, url) VALUES ('${reportId}', '${escapeSql(url)}')`,
    );
  }
}

/**
 * Check if a cached report is still valid (not expired).
 */
export function isReportValid(report: ResearchReport): boolean {
  if (report.status !== "completed") return false;
  if (!report.expiresAt) return false;
  return new Date(report.expiresAt) > new Date();
}

/**
 * Mark a report as failed.
 */
export function failReport(reportId: string, errorNotes: string): void {
  const now = new Date().toISOString();
  dbQuery(
    `UPDATE research_reports SET status = 'failed', ai_research_notes = '${escapeSql(errorNotes)}', updated_at = '${now}' WHERE id = '${reportId}'`,
  );
}

// ── Private helpers ─────────────────────────────────────────────────────────

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

function mapRowToReport(row: Record<string, unknown>): ResearchReport {
  return {
    id: row.id as string,
    targetType: row.target_type as "product" | "ingredient",
    targetId: row.target_id as string,
    status: row.status as ReportStatus,
    aiSummary: (row.ai_summary as string) ?? undefined,
    aiKeyFindings: row.ai_key_findings
      ? (JSON.parse(row.ai_key_findings as string) as string[])
      : undefined,
    aiEstimatedEfficacy: (row.ai_estimated_efficacy as number) ?? undefined,
    aiResearchNotes: (row.ai_research_notes as string) ?? undefined,
    generatedAt: (row.generated_at as string) ?? undefined,
    expiresAt: (row.expires_at as string) ?? undefined,
    viewCount: row.view_count as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}