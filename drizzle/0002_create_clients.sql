-- Create clients table for StartwiseCRM

CREATE TABLE IF NOT EXISTS "clients" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "team_id" text NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "contact_info" text NOT NULL DEFAULT '',
  "billing_info" text NOT NULL DEFAULT '',
  "status" text NOT NULL DEFAULT 'active', -- active|inactive|archived
  "notes" text NOT NULL DEFAULT '',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "clients_team_id_idx" ON "clients"("team_id");