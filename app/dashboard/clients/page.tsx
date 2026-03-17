import { eq, and, or, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { clients, teamMembers } from "@/lib/db/schema";
import ClientPage from "./client";

// For App Router: set to dynamic
export const dynamic = "force-dynamic";

// Accepts searchParams from Next.js as { [key: string]: string | string[] | undefined }
type RawQuery = undefined | string | string[];

function toStr(val: RawQuery, fallback = ""): string {
  if (!val) return fallback;
  if (Array.isArray(val)) return val[0] ?? fallback;
  return val;
}

export default async function ClientsPage({ searchParams }: { searchParams?: Record<string, RawQuery> }) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  // Resolve team for this user
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  if (!membership) redirect("/dashboard");
  const teamId = membership.teamId;
  const role = membership.role;

  // Parse params safely
  let search = "";
  let status: string | undefined = "active";
  if (searchParams) {
    search = toStr(searchParams["search"], "");
    const rawStatus = toStr(searchParams["status"], "active");
    status = rawStatus === "all" ? undefined : rawStatus;
  }

  // Build filter
  let whereExpr: any = eq(clients.teamId, teamId);
  if (status && ["active", "inactive", "archived"].includes(status)) {
    whereExpr = and(whereExpr, eq(clients.status, status));
  }
  if (search) {
    const likeVal = `%${search}%`;
    whereExpr = and(
      whereExpr,
      or(
        clients.name.ilike ? clients.name.ilike(likeVal) : eq(clients.name, search),
        clients.contactInfo && clients.contactInfo.ilike ? clients.contactInfo.ilike(likeVal) : eq(clients.contactInfo, search)
      )
    );
  }

  // Ensure clients table exists - error 42P01 = table missing => run migration
  let clientList = [];
  try {
    clientList = await db
      .select()
      .from(clients)
      .where(whereExpr)
      .orderBy(desc(clients.updatedAt));
  } catch (err: any) {
    if (err.message && err.message.includes('relation "clients" does not exist')) {
      // Render a dev-only hint
      return (
        <div className="max-w-2xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Database Migration Required</h1>
          <p className="mb-2">The "clients" table does not exist yet.</p>
          <p className="mb-2 text-sm text-muted-foreground">
            Please run <span className="font-mono bg-muted px-1">npm run db:generate</span> then <span className="font-mono bg-muted px-1">npm run db:migrate</span> and reload.
          </p>
          <pre className="mt-4 p-4 bg-muted rounded">{err.message}</pre>
        </div>
      );
    }
    throw err;
  }

  return (
    <ClientPage
      clients={clientList}
      teamRole={role}
    />
  );
}