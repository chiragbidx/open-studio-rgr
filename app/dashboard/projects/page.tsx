import { eq, desc, and, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { projects, clients as clientsTable, teamMembers } from "@/lib/db/schema";
import ProjectsClientPage from "./client";

// Set Opt-in dynamic (latest clients/projects)
export const dynamic = "force-dynamic";

// Accepts searchParams as { [key: string]: string | string[] | undefined }
type RawQuery = undefined | string | string[];

function toStr(val: RawQuery, fallback = ""): string {
  if (!val) return fallback;
  if (Array.isArray(val)) return val[0] ?? fallback;
  return val;
}

export default async function ProjectsPage({ searchParams }: { searchParams?: Record<string, RawQuery> }) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  // Resolve team/role
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  if (!membership) redirect("/dashboard");
  const teamId = membership.teamId;
  const role = membership.role;

  // Fetch clients (for dropdown linking)
  const clients = await db
    .select({
      id: clientsTable.id,
      name: clientsTable.name,
    })
    .from(clientsTable)
    .where(eq(clientsTable.teamId, teamId))
    .orderBy(desc(clientsTable.updatedAt));

  // Handle search/filter
  let search = "";
  let status: string | undefined = undefined;
  let filterClientId: string | undefined = undefined;
  if (searchParams) {
    search = toStr(searchParams["search"], "");
    status = toStr(searchParams["status"], "");
    if (status === "all") status = undefined;
    filterClientId = toStr(searchParams["clientId"], "");
    if (!filterClientId) filterClientId = undefined;
  }

  // Projects query
  let whereExpr: any = eq(projects.teamId, teamId);
  if (status && ["planned","active","completed","on_hold","archived"].includes(status)) {
    whereExpr = and(whereExpr, eq(projects.status, status));
  }
  if (filterClientId) {
    whereExpr = and(whereExpr, eq(projects.clientId, filterClientId));
  }
  if (search) {
    const likeVal = `%${search}%`;
    whereExpr = and(
      whereExpr,
      or(
        projects.title.ilike ? projects.title.ilike(likeVal) : eq(projects.title, search),
        projects.description && projects.description.ilike ? projects.description.ilike(likeVal) : eq(projects.description, search)
      )
    );
  }

  // Join with client for display name
  const projectList = await db
    .select({
      id: projects.id,
      clientId: projects.clientId,
      clientName: clientsTable.name,
      title: projects.title,
      status: projects.status,
      budget: projects.budget,
      timeline: projects.timeline,
      assigned: projects.assigned,
      description: projects.description,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .innerJoin(clientsTable, eq(projects.clientId, clientsTable.id))
    .where(whereExpr)
    .orderBy(desc(projects.updatedAt));

  return (
    <ProjectsClientPage
      projects={projectList}
      clients={clients}
      teamRole={role}
    />
  );
}