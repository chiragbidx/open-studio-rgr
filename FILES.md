# FILES.md — Structural & Architectural Index (Next.js App Router Starter)

AI-facing index of the repository as it exists today. Drizzle ORM (PostgreSQL) is wired with a working credentials auth flow at `/auth` (server actions + users table). If something is unclear: **STOP AND ASK**.

---

## 1. High-Level Overview
- Purpose: SaaS boilerplate with App Router, Drizzle + Postgres schema, multi-tenant teams, and modular section-based landing architecture.
- Style: file-system routing, server-preferred components, small isolated client islands.
- Tech: Next.js 16, React 19, TypeScript 5, Tailwind-ready PostCSS, ESLint 9, Zod for validation, SendGrid for email.
- Present: Drizzle schema + migrations for `users`, `teams`, `team_members`, `team_invitations`, `feature_items`, `clients`, `projects`; `/auth` route with sign-in/sign-up server actions; shared dashboard layout with overview, settings (profile/email/password), team management, clients CRUD, projects CRUD, and a DB-backed feature CRUD reference page; invitation acceptance flow; reusable UI primitives; centralized theme system.
- Not present: middleware guards, API routes, queues, tests.

## 2. Application Entry Points
- `app/layout.tsx`: Root layout; mounts `ThemeProvider`, global CSS, and `ErrorReporter`.
- `app/page.tsx`: Public landing page (server component) that composes `Layout*Section` components.
- `app/auth/page.tsx`: Server route entry for `/auth`; reads request params and renders `app/auth/client.tsx`.
- `app/auth/client.tsx`: Client auth UI (sign-in/sign-up toggle, hash mode sync, form interactivity).
- `app/auth/actions.ts`: Server actions that read/write users in Postgres through Drizzle; auto-creates team on signup.
- `app/dashboard/layout.tsx`: Shared dashboard layout (sidebar, header, auth guard) for all `/dashboard/*` routes.
- `app/dashboard/page.tsx`: Server route entry for `/dashboard`; loads session/data and renders `app/dashboard/client.tsx`.
- `app/dashboard/client.tsx`: Client dashboard overview UI.
- `app/dashboard/actions.tsx`: Shared dashboard server actions (currently sign-out).
- `app/dashboard/settings/page.tsx`: Server route entry for `/dashboard/settings`; loads user/status data and renders `app/dashboard/settings/client.tsx`.
- `app/dashboard/settings/client.tsx`: Client settings UI (profile/email/password/danger zone forms).
- `app/dashboard/settings/actions.tsx`: Settings server actions (`updateProfileAction`, `updateEmailAction`, `updatePasswordAction`, `deleteAccountAction`).
- `app/dashboard/team/page.tsx`: Server route entry for `/dashboard/team`; loads team/member/invitation data and renders `app/dashboard/team/client.tsx`.
- `app/dashboard/team/client.tsx`: Client team management UI (members, invitations, role controls, invite form).
- `app/dashboard/team/actions.tsx`: Team server actions (invite, revoke, remove, role update, team name).
- `app/dashboard/clients/page.tsx`: Server route entry for `/dashboard/clients`; loads client data, team, and renders `app/dashboard/clients/client.tsx`
- `app/dashboard/clients/client.tsx`: Client CRUD UI for clients table (list, add/edit/archive, search/filter, empty states).
- `app/dashboard/clients/actions.tsx`: Clients server actions (createClient, updateClient, archive/unarchive with RBAC and tenant-scope).
- `app/dashboard/projects/page.tsx`: Server route entry for `/dashboard/projects`; loads project data, team, and renders `app/dashboard/projects/client.tsx`
- `app/dashboard/projects/client.tsx`: Client CRUD UI for projects table (list, add/edit/archive, search/filter, link to clients, empty states).
- `app/dashboard/projects/actions.tsx`: Projects server actions (createProject, updateProject, archive/unarchive, RBAC, tenant scope).
- `app/dashboard/feature/page.tsx`: Server route entry for `/dashboard/feature`; resolves auth/team scope and loads `feature_items`.
- `app/dashboard/feature/client.tsx`: Client feature CRUD UI (list table, add/edit dialogs, delete action, flash status).
- `app/dashboard/feature/actions.tsx`: Feature server actions (`createFeatureItemAction`, `updateFeatureItemAction`, `deleteFeatureItemAction`) with Zod + tenant/role guards.
- `app/invite/[token]/page.tsx`: Invitation acceptance page (validates token, adds user to team).
- `app/invite/[token]/actions.ts`: Server action for accepting invitations.
- `app/globals.css`: Global styles; imports Tailwind and design tokens.
- `app/shadcn.css`: shadcn/radix utility classes + keyframes.
- `next.config.ts`: Next config.
- `postcss.config.mjs`: PostCSS with `@tailwindcss/postcss`.
- No `middleware.ts`; requests go straight to App Router.

## 3. Modules / Feature Areas
[...unchanged except adding `clients`, `projects` to dashboard and Drizzle schema list...]