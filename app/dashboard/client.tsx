"use client";

import { DashboardContent } from "@/components/dashboard/dashboard-content";

// Purpose: Client UI for /dashboard.
// Use this file for interactive/dashboard presentation logic.

type ClientProps = {
  greeting: string;
  firstName: string;
};

export default function Client({ greeting, firstName }: ClientProps) {
  return (
    <DashboardContent
      greeting={greeting}
      firstName={firstName}
      // You can pass additional props when replacing DashboardContent for CRM
    />
  );
}