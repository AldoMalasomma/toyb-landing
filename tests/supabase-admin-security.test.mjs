import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getAdminSupabaseClient } from "../src/lib/admin-api.js";

const migrationPath = new URL(
  "../supabase/migrations/20261022120000_revoke_public_admin_rpc_execute.sql",
  import.meta.url,
);

const adminFunctions = [
  "waitlist_admin_stats()",
  "waitlist_admin_list(\n  boolean, text, boolean, text, date, date, int, int\n)",
  "waitlist_admin_invite_beta_emails(text[])",
  "waitlist_admin_invite_beta_segment(\n  boolean, text, boolean, text, date, date\n)",
  "waitlist_admin_set_beta_active(text, boolean)",
  "waitlist_admin_create_campaign(text, text, jsonb)",
  "waitlist_admin_campaign_add_recipients(uuid, text[])",
  "waitlist_admin_campaign_set_recipient_result(\n  uuid, text, text, text\n)",
  "waitlist_admin_campaign_mark_sent(uuid, int)",
  "waitlist_admin_get_campaign(uuid)",
  "waitlist_admin_list_campaign_recipients(uuid, int, int)",
  "waitlist_admin_campaign_begin_send(uuid)",
  "waitlist_admin_campaign_finish_send(uuid, int)",
  "waitlist_admin_campaign_mark_failed(uuid)",
];

test("admin Supabase client fails closed without the service-role key", () => {
  assert.equal(
    getAdminSupabaseClient({
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "public-test-key",
    }),
    null,
  );
});

test("admin Supabase client requires the server-only service-role key", () => {
  const client = getAdminSupabaseClient({
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "server-test-key",
  });

  assert.ok(client);
  assert.equal(client.supabaseKey, "server-test-key");
});

test("corrective migration revokes public RPC access and grants service_role", async () => {
  const migration = await readFile(migrationPath, "utf8");

  for (const functionSignature of adminFunctions) {
    const escaped = functionSignature.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const functionPattern = escaped.replaceAll("\\\\n", "\\\\s+");
    const functionRegex = new RegExp(
      `function public\\.${functionPattern}`,
      "m",
    );

    assert.match(migration, functionRegex);
  }

  assert.equal(
    (migration.match(/from public, anon, authenticated;/g) ?? []).length,
    14,
  );
  assert.equal((migration.match(/to service_role;/g) ?? []).length, 14);
});
