"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { projects, clients, teamMembers } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";

// RBAC utility
async function requireEditableRole(userId: string, teamId: string) {
  const [membership] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .where(eq(teamMembers.teamId, teamId))
    .limit(1);
  if (!membership || !["admin", "owner"].includes(membership.role)) {
    throw new Error("You do not have permission to modify projects.");
  }
}

const projectFormSchema = z.object({
  title: z.string().min(2).max(255),
  clientId: z.string().min(1),
  status: z.enum(["planned", "active", "completed", "on_hold", "archived"]),
  budget: z.string().max(255).optional(),
  timeline: z.string().max(255).optional(),
  assigned: z.string().max(255).optional(),
  description: z.string().max(2048).optional(),
});

export async function createProjectAction(form: z.infer<typeof projectFormSchema>) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated.");
  // Get user -> teamId
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);
  if (!membership) throw new Error("Not a team member.");
  await requireEditableRole(session.userId, membership.teamId);

  // FK validation: client must exist in same team
  const [client] = await db.select().from(clients)
    .where(eq(clients.id, form.clientId))
    .where(eq(clients.teamId, membership.teamId))
    .limit(1);
  if (!client) throw new Error("Client not found for your team.");

  await db.insert(projects).values({
    teamId: membership.teamId,
    clientId: form.clientId,
    title: form.title,
    status: form.status,
    budget: form.budget ?? "",
    timeline: form.timeline ?? "",
    assigned: form.assigned ?? "",
    description: form.description ?? "",
  });
}

export async function updateProjectAction(data: { id: string } & z.infer<typeof projectFormSchema>) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated.");
  const [existing] = await db.select().from(projects).where(eq(projects.id, data.id)).limit(1);
  if (!existing) throw new Error("Not found.");
  // Only allow edits in own tenant
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);
  if (!membership || membership.teamId !== existing.teamId) throw new Error("No access to this project.");
  await requireEditableRole(session.userId, membership.teamId);

  // FK validation: client must exist in same team
  const [client] = await db.select().from(clients)
    .where(eq(clients.id, data.clientId))
    .where(eq(clients.teamId, membership.teamId))
    .limit(1);
  if (!client) throw new Error("Client not found for your team.");

  await db
    .update(projects)
    .set({
      title: data.title,
      clientId: data.clientId,
      status: data.status,
      budget: data.budget ?? "",
      timeline: data.timeline ?? "",
      assigned: data.assigned ?? "",
      description: data.description ?? "",
      updatedAt: new Date(),
    })
    .where(eq(projects.id, data.id));
}

export async function archiveProjectAction({ id }: { id: string }) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated.");
  const [existing] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!existing) throw new Error("Not found.");
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);
  if (!membership || membership.teamId !== existing.teamId) throw new Error("No access to this project.");
  await requireEditableRole(session.userId, membership.teamId);

  await db.update(projects).set({ status: "archived", updatedAt: new Date() }).where(eq(projects.id, id));
}

export async function unarchiveProjectAction({ id }: { id: string }) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated.");
  const [existing] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!existing) throw new Error("Not found.");
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);
  if (!membership || membership.teamId !== existing.teamId) throw new Error("No access to this project.");
  await requireEditableRole(session.userId, membership.teamId);

  await db.update(projects).set({ status: "active", updatedAt: new Date() }).where(eq(projects.id, id));
}