"use server";

import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { clients, teamMembers } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";

// RBAC utility
async function requireEditableRole(userId: string, teamId: string) {
  const [membership] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(
      and(
        eq(teamMembers.userId, userId),
        eq(teamMembers.teamId, teamId)
      )
    )
    .limit(1);
  if (!membership || !["admin", "owner"].includes(membership.role)) {
    throw new Error("You do not have permission to modify clients.");
  }
}

const clientFormSchema = z.object({
  name: z.string().min(2).max(255),
  contactInfo: z.string().max(255).optional(),
  billingInfo: z.string().max(255).optional(),
  status: z.enum(["active", "inactive", "archived"]),
  notes: z.string().max(2048).optional(),
});

export async function createClientAction(form: z.infer<typeof clientFormSchema>) {
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

  await db.insert(clients).values({
    teamId: membership.teamId,
    name: form.name,
    contactInfo: form.contactInfo ?? "",
    billingInfo: form.billingInfo ?? "",
    notes: form.notes ?? "",
    status: form.status,
  });
}

export async function updateClientAction(data: { id: string } & z.infer<typeof clientFormSchema>) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated.");
  const [existing] = await db.select().from(clients).where(eq(clients.id, data.id)).limit(1);
  if (!existing) throw new Error("Not found.");
  // Only allow edits in own tenant
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);
  if (!membership || membership.teamId !== existing.teamId) throw new Error("No access to this client.");
  await requireEditableRole(session.userId, membership.teamId);

  await db
    .update(clients)
    .set({
      name: data.name,
      contactInfo: data.contactInfo ?? "",
      billingInfo: data.billingInfo ?? "",
      notes: data.notes ?? "",
      status: data.status,
      updatedAt: new Date(),
    })
    .where(eq(clients.id, data.id));
}

export async function archiveClientAction({ id }: { id: string }) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated.");
  const [existing] = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  if (!existing) throw new Error("Not found.");
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);
  if (!membership || membership.teamId !== existing.teamId) throw new Error("No access to this client.");
  await requireEditableRole(session.userId, membership.teamId);

  await db.update(clients).set({ status: "archived", updatedAt: new Date() }).where(eq(clients.id, id));
}

export async function unarchiveClientAction({ id }: { id: string }) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated.");
  const [existing] = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  if (!existing) throw new Error("Not found.");
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);
  if (!membership || membership.teamId !== existing.teamId) throw new Error("No access to this client.");
  await requireEditableRole(session.userId, membership.teamId);

  await db.update(clients).set({ status: "active", updatedAt: new Date() }).where(eq(clients.id, id));
}