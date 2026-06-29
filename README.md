<p align="center">
  <img alt="ClaimFlow" src="https://raw.githubusercontent.com/NICE-DEV226/webflow-frontend/main/public/brand/logo.png" width="160" height="160">
</p>

<h1 align="center">ClaimFlow</h1>

<p align="center">
  <em>From claim to payout, in one traceable pipeline.</em>
</p>

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/Next.js-16.2-000?logo=next.js" alt="Next.js"></a>
  <a href="#features"><img src="https://img.shields.io/badge/React-19-087ea4?logo=react" alt="React"></a>
  <a href="#features"><img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript" alt="TypeScript"></a>
  <a href="#features"><img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss" alt="Tailwind CSS"></a>
  <a href="#license"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License"></a>
</p>

---

## Overview

ClaimFlow is a multi-tenant insurance claims management SaaS for mid-market insurers in Africa and emerging markets. It replaces fragmented email-and-spreadsheet workflows with a unified digital pipeline spanning submission, agent evaluation, approval workflows, and payout.

The platform supports three roles — **policyholder**, **claims agent**, and **administrator** — each with a dedicated dashboard. A **super-admin** panel provides cross-tenant oversight, license management, and audit.

---

## Features

- **Multi-tenant architecture** — Subdomain-based tenant resolution with isolated branding (logo, colors, company info)
- **Three-role dashboards** — Policyholder (submit & track), Agent (queue & evaluate), Admin (oversee & configure)
- **Super-admin panel** — Cross-tenant metrics, license management, audit trail
- **Onboarding wizard** — Guided setup: company profile → plan selection → ready state
- **Agent management** — Invite members, assign roles, manage permissions per tenant
- **RBAC** — Role-based access control with fine-grained permissions per plugin (xclaims, xtasks, etc.)
- **Smart workflow engine** — Auto-approve low-value claims, round-robin / load-balanced / manual agent routing, configurable auto-reject timers
- **Notification system** — Real-time SSE and email notifications, mark-as-read, mark-all-as-read
- **Branding & configuration** — Upload logo, pick brand colors, manage public form links
- **Audit trail** — Every claim status change and sensitive action is logged
- **Internationalization** — English and French via `next-intl` v4
- **Responsive design** — Mobile-first with cloud-white content area and signature navy sidebar
- **Public claim forms** — Embedded `f/[slug]` forms for external claimants

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS v4, shadcn/ui, @base-ui/react |
| **Animation** | Motion (Framer Motion), Lottie |
| **Forms** | react-hook-form + Zod |
| **Icons** | Lucide React, custom SVG brand components |
| **Internationalization** | next-intl v4 (en/fr) |
| **Theming** | next-themes |
| **State** | React Context (auth, tenant, onboarding) |
| **API layer** | Custom `fetch` wrapper with JWT Bearer auth, refresh token rotation |
| **Real-time** | SSE via WebSocket manager (xpulse) |

---

## Architecture

```
src/
├── app/[locale]/            # Route segments
│   ├── admin/               # Dashboard, claims, agents, settings, audit, workflows
│   ├── agent/               # Queue, evaluations, notifications
│   ├── dashboard/           # Policyholder claims, notifications
│   ├── super-admin/         # Dashboard, tenants, licenses, audit
│   ├── onboarding/          # Multi-step wizard
│   ├── register/            # Registration
│   ├── login/               # Sign-in
│   └── f/[slug]             # Public claim submission forms
├── components/
│   ├── auth/                # Login & registration forms
│   ├── brand/               # Logo, LogoMark SVGs
│   ├── admin/               # Settings tabs (branding, public links, workflow)
│   ├── onboarding/          # Wizard steps (company, plan, review)
│   ├── notifications/       # Notification list with time-ago formatting
│   └── layout/              # App shell, sidebar, nav guards
├── lib/
│   ├── api/                 # API client, typed modules (auth, claims, agents, tenants, etc.)
│   │   ├── client.ts        # Fetch wrapper with JWT, error handling
│   │   ├── auth.ts          # Login, register, refresh, logout
│   │   ├── claims.ts        # Claim CRUD, admin stats
│   │   ├── agents.ts        # Member & invite management, role assignment
│   │   ├── tenants.ts       # Tenant settings, branding
│   │   ├── platform.ts      # Super-admin metrics
│   │   ├── notifications.ts # Notification CRUD
│   │   ├── public-links.ts  # Public form link management
│   │   └── with-server-auth.ts # Server-side token extraction from cookies
│   ├── tenant.ts            # Tenant type, subdomain resolution
│   └── tenant-server.ts     # Server-side tenant resolution
└── messages/                # i18n JSON (en.json, fr.json)
```

### Key decisions

- **Real API-first** — All data flows through a backend at `claimflow.xcorehub.dev` using JWT RS256 authentication
- **Tenant context** — `TenantProvider` wraps the app; `useTenant()` hook gives any component access to the current tenant
- **Subdomain routing** — `getTenantFromHost(host)` resolves tenant from the request hostname
- **Cookie + localStorage** — JWT is stored in both for client-side and server-component access
- **Plugin-based backend** — The xcore framework behind the API uses a plugin architecture (Orchauth for auth, xclaims for claims, xtasks for tasks, xpulse for notifications)

---

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### Environment variables

```env
NEXT_PUBLIC_API_URL=https://claimflow.xcorehub.dev
# or http://localhost:8000 for local backend
```

---

## User Flows

### Policyholder
```
Landing → /register → /onboarding (company → plan → review) → /dashboard/claims
```

### Agent
```
/login → /agent/queue → evaluate claims → approve/reject
```

### Admin
```
/login → /admin/dashboard → manage claims, agents, branding, settings
```

### Super-admin
```
/login → /super-admin/dashboard → cross-tenant metrics, licenses, audit
```

---

## Build

```bash
pnpm build
```

The build generates all static routes with zero TypeScript errors.

---

## License

MIT
