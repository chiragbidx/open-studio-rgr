import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { clients, teamMembers } from "@/lib/db/schema";
import ClientPage from "./client";

export const dynamic = "force-dynamic";

const searchParamsSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(), // e.g. active|inactive|archived|all
});

export default async function ClientsPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  // Find teamId via session user
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  if (!membership) redirect("/dashboard");

  const teamId = membership.teamId;
  const role = membership.role;

  let search = "";
  let status = "active";
  if (searchParams) {
    const parsed = searchParamsSchema.safeParse(searchParams);
    if (parsed.success) {
      search = parsed.data.search ?? "";
      status = parsed.data.status === "all" ? undefined : (parsed.data.status ?? "active");
    }
  }

  let query = db.select().from(clients).where(eq(clients.teamId, teamId));
  if (status && ["active","inactive","archived"].includes(status)) {
    query = query.where(eq(clients.status, status));
  }
  // Search by name or contact info (case-insensitive)
  // (basic LIKE + ILIKE may differ per driver, simplest for demo use)
  if (search) {
    query = query.where((row) =>
      row.name.ilike(`%${search}%`) || row.contactInfo.ilike(`%${search}%`)
    );
  }
  const clientList = await query.orderBy(clients.updatedAt.desc()).all();

  return (
    <ClientPage
      clients={clientList}
      teamRole={role}
    />
  );
}