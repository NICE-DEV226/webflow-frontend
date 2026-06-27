<p align="center">
  <img alt="ClaimFlow" src="https://raw.githubusercontent.com/NICE-DEV226/webflow-frontend/main/public/brand/logo.png" width="160" height="160">
</p>

# ClaimFlow

> From claim to payout, in one traceable pipeline.

**ClaimFlow** is a multi-tenant insurance claims management SaaS built during a hackathon. It streamlines the full claims lifecycle — submission, agent evaluation, approval workflows, and payout — for mid-market insurers in Africa and emerging markets.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-087ea4?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](#license)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Flow](#user-flow)
- [Build](#build)
- [License](#license)

---

## Overview

ClaimFlow replaces fragmented email-and-spreadsheet workflows with a unified digital pipeline. It supports three roles — **policyholder**, **claims agent**, and **administrator** — each with a dedicated dashboard and claim lifecycle views.

Built as a hackathon proof-of-concept, the frontend is fully functional with mocked data stores ready to be swapped for real API integrations.

---

## Features

- **Multi-tenant architecture** — Subdomain-based tenant resolution with isolated branding (logo, colors, company info)
- **Three-role dashboards** — Policyholder (submit & track), Agent (queue & evaluate), Admin (oversee & configure)
- **Onboarding wizard** — Guided 3-step setup: company info → plan selection → getting started guide
- **Smart workflow engine** — Auto-approve low-value claims, round-robin / load-balanced / manual agent routing, configurable auto-reject timers
- **Branding & configuration** — Upload logo, pick brand colors, manage `f/[slug]` public form links
- **Audit trail** — Trace every claim status change for regulatory compliance
- **i18n ready** — English and French built-in via `next-intl` v4; locale prefix `as-needed`
- **Responsive design** — Mobile-first, cloud-white content area with signature navy sidebar

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS v4, shadcn/ui, @base-ui/react |
| **Animation** | Motion (Framer Motion), Lottie (@lottiefiles/dotlottie-react) |
| **Forms** | react-hook-form + Zod |
| **Icons** | Lucide React, custom SVG brand components |
| **Internationalization** | next-intl v4 (en/fr) |
| **Theming** | next-themes |

---

## Architecture

```
src/
├── app/[locale]/       # Route segments (landing, auth, onboarding, admin, agent, claimant)
│   ├── admin/          # Admin dashboard, claims, agents, settings, audit trail
│   ├── agent/          # Agent queue, evaluations
│   ├── claimant/       # My claims, new claim
│   ├── onboarding/     # Multi-step wizard
│   ├── register/       # Registration
│   └── login/          # Sign-in
├── components/         # Shared UI components
│   ├── auth/           # Login & registration forms
│   ├── brand/          # Logo, LogoMark SVGs
│   ├── admin/          # Settings tabs (branding, public links, workflow)
│   └── onboarding/     # Wizard steps (company, plan, success)
├── lib/                # Utilities, mock stores, tenant resolution
│   ├── tenant.ts       # Tenant type, subdomain resolution
│   ├── mock-tenants.ts # In-memory tenant CRUD
│   └── mock-public-links.ts # In-memory public link CRUD
└── messages/           # i18n JSON (en.json, fr.json)
```

**Key decisions:**
- **Mock-first** — No backend dependency. All data lives in `src/lib/mock-*.ts` for rapid iteration and demo.
- **Tenant context** — `TenantProvider` wraps the app; `useTenant()` hook gives any component access to the current tenant.
- **Subdomain routing** — `getTenantFromHost(host)` resolves tenant from the request hostname.

---

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

---

## User Flow

```
Landing → /register → /onboarding → Company Step
                                     → Plan Step
                                     → Success Step → /admin/dashboard
```

---

## Build

```bash
pnpm build
```

The build generates all static routes (24 total) with zero TypeScript or page-generation errors.

---

## License

This project was created for a hackathon. All rights reserved unless otherwise specified.
