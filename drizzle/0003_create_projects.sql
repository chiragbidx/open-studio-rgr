-- Create projects table for StartwiseCRM

CREATE TABLE IF NOT EXISTS "projects" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "team_id" text NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "client_id" text NOT NULL REFERENCES "clients"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "status" text NOT NULL DEFAULT 'planned', -- planned|active|completed|on_hold|archived
  "budget" text NOT NULL DEFAULT '',
  "timeline" text NOT NULL DEFAULT '',
  "assigned" text NOT NULL DEFAULT '',
  "description" text NOT NULL DEFAULT '',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "projects_team_id_idx" ON "projects"("team_id");
CREATE INDEX IF NOT EXISTS "projects_client_id_idx" ON "projects"("client_id");