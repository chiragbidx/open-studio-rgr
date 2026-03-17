import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ...existing tables...

export const users = pgTable("users", {
  id: text("id")
    .notNull()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const teams = pgTable("teams", {
  id: text("id")
    .notNull()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const teamMembers = pgTable(
  "team_members",
  {
    id: text("id")
      .notNull()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("team_members_team_user_idx").on(table.teamId, table.userId),
  ]
);

export const teamInvitations = pgTable("team_invitations", {
  id: text("id")
    .notNull()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role").notNull().default("member"),
  token: text("token").notNull().unique(),
  invitedByUserId: text("invited_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const featureItems = pgTable("feature_items", {
  id: text("id")
    .notNull()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const clients = pgTable("clients", {
  id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
  teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  contactInfo: text("contact_info").notNull().default(""),
  billingInfo: text("billing_info").notNull().default(""),
  status: text("status").notNull().default("active"), // active, inactive, archived
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- StartwiseCRM Projects Table ---
export const projects = pgTable("projects", {
  id: text("id").notNull().default(sql`gen_random_uuid()`).primaryKey(),
  teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  clientId: text("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  status: text("status").notNull().default("planned"), // planned, active, completed, on_hold, archived
  budget: text("budget").notNull().default(""), // can be formatted price string, or numeric with formatting
  timeline: text("timeline").notNull().default(""), // free text for MVP (start/end or due date)
  assigned: text("assigned").notNull().default(""), // owner/team (userId list or string for MVP)
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});