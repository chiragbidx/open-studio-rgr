// ─── Hero ───────────────────────────────────────────────────────────────────
export type HeroContent = {
  badgeInner: string;
  badgeOuter: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  heroImageLight: string;
  heroImageDark: string;
  heroImageAlt: string;
};

// ... [type definitions unchanged] ...

export const defaultHomeContent: HomeContent = {
  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    badgeInner: "Startup Teams",
    badgeOuter: "Introducing StartwiseCRM",
    titleBefore: "Powerful, seamless",
    titleHighlight: "CRM Operations",
    titleAfter: "for internal startup teams",
    subtitle:
      "StartwiseCRM is your all-in-one toolkit for managing clients, projects, invoices, and team collaboration—purpose-built for startups.",
    primaryCta: { label: "Log in to StartwiseCRM", href: "/auth#signin" },
    secondaryCta: { label: "Explore how it works", href: "#how-it-works" },
    heroImageLight: "/hero-image-light.jpeg",
    heroImageDark: "/hero-image-dark.jpeg",
    heroImageAlt: "StartwiseCRM dashboard preview",
  },

  // ── Sponsors ─────────────────────────────────────────────────────────────
  sponsors: {
    heading: "Trusted by Startup Teams",
    items: [
      { icon: "Rocket", name: "Startups" },
      { icon: "Users", name: "Small Teams" },
      { icon: "TrendingUp", name: "Growth Leaders" },
      { icon: "Handshake", name: "Scaleups" },
    ],
  },

  // ── Benefits ─────────────────────────────────────────────────────────────
  benefits: {
    eyebrow: "Why StartwiseCRM",
    heading: "Empowering internal teams with practical CRM flows",
    description:
      "Designed for startups who want simplicity, speed, and security in their client, project, and invoice management. Eliminate scattered spreadsheets and sync your work into one, unified platform.",
    items: [
      {
        icon: "Layers",
        title: "Truly Multi-Tenant",
        description: "All client, project, and financial data is tenant-scoped—perfect for internal startup operations.",
      },
      {
        icon: "Briefcase",
        title: "Client & Project Management",
        description: "Handle every client relationship, project timeline, and billing lifecycle in one secure, responsive space.",
      },
      {
        icon: "ShieldCheck",
        title: "Secure & Accessible",
        description: "WCAG-compliant design, strict role-based controls, and modern authentication for your peace of mind.",
      },
      {
        icon: "Activity",
        title: "Built for Growing Teams",
        description: "Collaboration, status tracking, and reporting—no more manual follow-ups or lost context.",
      },
    ],
  },

  // ── Features ─────────────────────────────────────────────────────────────
  features: {
    eyebrow: "Workflow Features",
    heading: "Everything startups need for internal CRM",
    subtitle:
      "From the first client call to the last invoice—StartwiseCRM keeps your team ahead, organized, and always in sync.",
    items: [
      { icon: "UserPlus", title: "Client Directory", description: "Centralize all client data, contact info, notes, and status—never lose track again." },
      { icon: "ClipboardList", title: "Projects & Tasks", description: "Plan, delegate, and track project progress, timelines, assignments, and deliverables." },
      { icon: "FileText", title: "Invoices & Payments", description: "Create, send, and manage invoices with clear status (draft, sent, paid, overdue) and line-item control." },
      { icon: "ListChecks", title: "Activity Tracking", description: "Review comments, changes, and milestones across every project or client." },
      { icon: "BarChart3", title: "Real-Time Reporting", description: "Instant dashboards for projects, outstanding payments, and upcoming deadlines." },
      { icon: "Users", title: "Team Collaboration", description: "Role-based workflows for admins, managers, and team members." },
    ],
  },

  // ── Services ─────────────────────────────────────────────────────────────
  services: {
    eyebrow: "How StartwiseCRM Helps",
    heading: "Designed for internal SaaS use",
    subtitle:
      "Startup founders, managers, and team members work better together with: ",
    items: [
      { title: "Role-Based Permissions", description: "Admins, managers, and members all only see and act on what they’re allowed to.", pro: false },
      { title: "Tenant Data Isolation", description: "Only your startup team can see your CRM data—never shared outside.", pro: false },
      { title: "CRM Project Workflows", description: "Clients, projects, invoices, tasks, and comments: all linked and discoverable.", pro: false },
      { title: "Accessible and Responsive", description: "Works perfectly on desktop and mobile, keyboard and screen reader ready.", pro: true },
    ],
  },

  // ── Testimonials ─────────────────────────────────────────────────────────
  testimonials: {
    eyebrow: "From Startup Teams",
    heading: "Teams boost productivity with StartwiseCRM",
    reviews: [
      { image: "/team1.jpg", name: "Chirag Dodiya", role: "Founder, bidx.ai", comment: "We replaced spreadsheets and random tools with StartwiseCRM. Our team finally works as one.", rating: 5.0 },
      { image: "/team2.jpg", name: "Priya R.", role: "COO, SaaS Labs", comment: "The visibility into project tasks and billing has transformed how our team collaborates.", rating: 4.9 },
      { image: "/team3.jpg", name: "Kevin Lin", role: "Lead Developer, LaunchSuite", comment: "Best onboarding we’ve ever had—fast, simple, and tailored for our real workflow.", rating: 5.0 },
    ],
  },

  // ── Team ─────────────────────────────────────────────────────────────────
  team: {
    eyebrow: "Who built StartwiseCRM?",
    heading: "The internal SaaS team you can trust",
    members: [
      {
        imageUrl: "/team1.jpg",
        firstName: "Chirag",
        lastName: "Dodiya",
        positions: ["Founder & Lead Architect"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://linkedin.com/in/chiragdodiya" },
          { name: "Github", url: "https://github.com/chiragdodiyadev" },
        ],
      },
      {
        imageUrl: "/team2.jpg",
        firstName: "Priya",
        lastName: "Raman",
        positions: ["Product Manager"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://linkedin.com/in/priyaraman" },
        ],
      },
      {
        imageUrl: "/team3.jpg",
        firstName: "Kevin",
        lastName: "Lin",
        positions: ["Engineering", "DX"],
        socialNetworks: [
          { name: "Github", url: "https://github.com/kevin-lin-dev" },
        ],
      },
    ],
  },

  // ── Pricing ──────────────────────────────────────────────────────────────
  pricing: {
    eyebrow: "Internal Use Only",
    heading: "No public plans—StartwiseCRM is for your startup’s team",
    subtitle: "Contact Chirag Dodiya (chirag@bidx.ai) for onboarding requests, custom flows, or enablement.",
    priceSuffix: "/mo",
    plans: [
      {
        title: "Internal Use",
        popular: true,
        price: 0,
        description: "All features, full security, unlimited team members. For your startup’s internal ops only.",
        buttonText: "Request Onboarding",
        benefits: [
          "All CRM features included",
          "Role-based access for every team member",
          "Secure multi-tenant separation",
          "Dedicated team support"
        ],
      },
    ],
  },

  // ── Contact ──────────────────────────────────────────────────────────────
  contact: {
    eyebrow: "Contact",
    heading: "Talk to StartwiseCRM",
    description:
      "Have a question, feedback, or custom use case? We’re here to help your startup move faster.",
    mailtoAddress: "chirag@bidx.ai",
    info: {
      address: { label: "Headquarters", value: "Remote-first • India & USA" },
      phone: { label: "Founder", value: "" },
      email: { label: "Email", value: "chirag@bidx.ai" },
      hours: { label: "Hours", value: ["Monday - Friday", "8AM - 6PM IST"] },
    },
    formSubjects: ["Onboarding Request", "Support Question", "Custom Flow", "Product Demo"],
    formSubmitLabel: "Contact StartwiseCRM",
  },

  // ── FAQ ──────────────────────────────────────────────────────────────────
  faq: {
    eyebrow: "Startup CRM Questions",
    heading: "Your most common questions, answered",
    items: [
      { question: "Is StartwiseCRM public SaaS?", answer: "No—StartwiseCRM is for internal startup/scaleup teams only, not for external client access." },
      { question: "Are all operations audit-logged?", answer: "Yes. Every action on clients, projects, and invoices is tracked for compliance and oversight." },
      { question: "How secure is tenant separation?", answer: "All data is isolated at the database and application level. No cross-team data access is possible." },
      { question: "Can we request features?", answer: "Absolutely! StartwiseCRM is evolving with feedback—reach out for custom flows or new features." },
      { question: "Do you offer onboarding support?", answer: "Yes. Direct help is available via email at chirag@bidx.ai." },
    ],
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    brandName: "StartwiseCRM",
    columns: [
      {
        heading: "Contact",
        links: [
          { label: "chirag@bidx.ai", href: "mailto:chirag@bidx.ai" },
        ],
      },
      {
        heading: "Features",
        links: [
          { label: "Clients", href: "#features" },
          { label: "Projects", href: "#features" },
          { label: "Invoices", href: "#features" },
          { label: "Reporting", href: "#features" },
        ],
      },
      {
        heading: "Support",
        links: [
          { label: "Contact", href: "#contact" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        heading: "Legal",
        links: [
          { label: "Terms", href: "/terms" },
          { label: "Privacy", href: "/privacy" },
        ],
      },
    ],
    copyright: "© 2026 StartwiseCRM SaaS for Startup Teams.",
    attribution: { label: "Built on Next.js", href: "https://nextjs.org" },
  },

  // ── Navbar ───────────────────────────────────────────────────────────────
  navbar: {
    brandName: "StartwiseCRM",
    routes: [
      { href: "/#how-it-works", label: "How it Works" },
      { href: "/#features", label: "Features" },
      { href: "/#contact", label: "Contact" },
      { href: "/#faq", label: "FAQ" },
    ],
    featureDropdownLabel: "CRM Features",
    featureImage: { src: "/hero-image-light.jpeg", alt: "StartwiseCRM feature preview" },
    features: [
      { title: "Clients & Contacts", description: "Easy CRUD, multi-status pipelines, robust search/filter." },
      { title: "Projects & Tasks", description: "Linked projects, tasks, milestones—full lifecycle coverage." },
      { title: "Invoices & Workflow", description: "Draft, send, and track finance flows for your startup." },
    ],
    signInLabel: "Sign in",
    signUpLabel: "Sign up",
    dashboardLabel: "Dashboard",
    githubLink: { href: "https://github.com/chiragdodiyadev/startwisecrm", ariaLabel: "View StartwiseCRM on GitHub" },
  },
};

export function getHomeContent(): HomeContent {
  return defaultHomeContent;
}