import { eq, and, or, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { clients, teamMembers } from "@/lib/db/schema";
import ClientPage from "./client";

// Ensure dynamic rendering (for runtime params)
export const dynamic = "force-dynamic";

// Validate search params as object with string values
const searchParamsSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
});

type SearchParams = { search?: string; status?: string };

// Next.js server components now receive searchParams as an object, not Promise.
// https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#searchparams-optional
export default async function ClientsPage({ searchParams }: { searchParams?: SearchParams }) {
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

  // Handle search/filter params
  let search = "";
  let status = "active";
  if (searchParams) {
    const parsed = searchParamsSchema.safeParse(searchParams);
    if (parsed.success) {
      search = parsed.data.search ?? "";
      status = parsed.data.status === "all" ? undefined : (parsed.data.status ?? "active");
    }
  }

  // Build query
  let whereExpr: any = eq(clients.teamId, teamId);
  if (status && ["active","inactive","archived"].includes(status)) {
    whereExpr = and(whereExpr, eq(clients.status, status));
  }
  if (search) {
    // Simple LIKE search across name, contactInfo
    whereExpr = and(
      whereExpr,
      or(
        clients.name.ilike ? clients.name.ilike(`%${search}%`) : eq(clients.name, search),
        clients.contactInfo && clients.contactInfo.ilike ? clients.contactInfo.ilike(`%${search}%`) : eq(clients.contactInfo, search)
      )
    );
  }
  const clientList = await db
    .select()
    .from(clients)
    .where(whereExpr)
    .orderBy(desc(clients.updatedAt));

  return (
    <ClientPage
      clients={clientList}
      teamRole={role}
    />
  );
}