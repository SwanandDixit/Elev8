<p align="center">
  <img src="https://img.shields.io/badge/Elev8-Employment%20Platform-1A56DB?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGV4dCB5PSIxOCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiPkU4PC90ZXh0Pjwvc3ZnPg==" />
</p>

<h1 align="center">Elev8 — Skill-Based Employment Platform for Blue-Collar Workers 🇮🇳</h1>

<p align="center">
  <strong>Connecting India's Skilled Workforce with Dignified Opportunities</strong>
</p>

<p align="center">
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black&style=flat-square" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white&style=flat-square" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=flat-square" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white&style=flat-square" /></a>
  <img src="https://img.shields.io/badge/Languages-EN%20%7C%20Hindi%20%7C%20Marathi-1A56DB?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

<p align="center">
  <a href="https://elev8888.netlify.app"><strong>🌐 Live Demo (elev8888.netlify.app)</strong></a> •
  <a href="https://screenrec.com/share/JOiMCEvVLH"><strong>🎥 Watch Demo Video</strong></a> •
  <a href="https://github.com/SwanandDixit/Elev8"><strong>💻 GitHub Repository</strong></a>
</p>

---

## 🔗 Quick Submission Links

| Deliverable | URL / Link |
| :--- | :--- |
| 🌐 **Live Working Demo** | [https://elev8888.netlify.app](https://elev8888.netlify.app) |
| 🎥 **Demo Video Recording** | [https://screenrec.com/share/JOiMCEvVLH](https://screenrec.com/share/JOiMCEvVLH) |
| 💻 **Source Code Repository** | [https://github.com/SwanandDixit/Elev8](https://github.com/SwanandDixit/Elev8) |
| 📄 **Full Documentation** | [Elev8_Documentation.html](./Elev8_Documentation.html) (Open & Export to PDF) |
| 📊 **Presentation Deck** | [Elev8_Presentation.html](./Elev8_Presentation.html) (Interactive 10-Slide Deck) |

---

## 🎯 Problem Statement

India has over **500 million blue-collar workers** — electricians, plumbers, carpenters, cooks, cleaners, drivers — yet they face:

- 🔴 **No digital identity** — skills go unrecognized without formal credentials
- 🔴 **Exploitative middlemen** — 40–60% commission taken by local agents
- 🔴 **Language barriers** — platforms built only in English exclude millions
- 🔴 **Zero trust infrastructure** — employers can't verify worker skills or background
- 🔴 **Household employers ignored** — platforms focus on businesses, not home services

**Elev8** solves all of this in one unified, multilingual, mobile-first platform.

---

## 💡 Solution — What is Elev8?

Elev8 is a **production-ready, skill-based employment platform** designed specifically for India's blue-collar workforce. It directly connects verified skilled workers with both household and business employers — cutting out middlemen, building trust through certification, and speaking the user's language.

---

## ✨ Key Features

### 🌐 Multilingual — First-Class Support
- **3 Languages**: English, हिंदी (Hindi), मराठी (Marathi)
- Instant switching with **no page reload**
- Devanagari script rendering via `Noto Sans Devanagari` font
- Language persisted across sessions via `localStorage`

### 🔍 Smart Job Discovery
- Search by **skill, location, keyword**
- Filter by **category, job type, pay range, verification status**
- Sort by **newest, highest pay, closest**
- Separate flows for **Household** and **Business** requirements

### 🛡️ Skill Verification & Trust System
- Partner certifications via **NSDC, ITI, Udemy, UpSkill India**
- **Elev8 Practical Assessment** badges — verified by platform
- Verified badges displayed on worker profiles and job cards

### 📱 Mobile-First Design
- Responsive from **375px (mobile) to 4K**
- Mobile **bottom navigation bar**
- Mobile **filter bottom sheets**
- 44px touch-friendly tap targets

### 🔐 Secure Authentication
- **Role-based access**: Worker / Employer / Admin
- **Google OAuth** via Supabase
- Protected routes with automatic role-based redirects
- **Offline Demo Mode** when Supabase credentials not configured

### 🏆 Worker Profiles
- Portfolio with skills, experience, availability
- Star ratings + verified reviews
- Hourly rates, travel distance, work preferences
- Premium listings for boosted visibility

### ⚖️ Real-Time Price Negotiation & Market Estimator (New)
- **Market Price Estimation Engine**: Suggests accurate Indian market wage ranges (hourly, daily, monthly, fixed) across all trades.
- **Urgency & Emergency Surcharge**: Automatic **+20% (Urgent)** and **+40% (Emergency/Very Urgent)** pricing calculations.
- **Interactive Offer/Counter-Offer UI**: Workers propose counter-rates with rationales; employers can accept, decline, or counter in real time.
- **Full Offer History Timeline**: Transparent record of proposals between workers and employers.

### 👥 Dual-Sided Platform & Customer Profiles (New)
- **Role-Distinct Onboarding**: Dedicated signup & login flows tailored for Workers (`👷`) and Customers/Employers (`🏠`).
- **Customer Dashboard**: Complete management of job requirements, incoming applicants, rate negotiations, and worker profiles.
- **Rich Customer Profiles**: Photo upload, task/household description, and contact info so workers can prepare adequately before arriving.

### 📍 GPS & Location-Aware Job Matching
- **Haversine Distance Matching**: Real-time GPS radius filter (5km, 10km, 25km, 50km) and "Near Me" instant detection.
- **Distance Badges**: Live distance calculations showing how close a job is to the worker.


## 📸 Screenshots

> _Home Page — Hero section with animated stats counter_

> _Find Work — Search & filters with responsive job card grid_

> _Browse Workers — Worker directory with availability filters_

> _Certifications — 3-tab verification system_

> _Worker Dashboard — Sidebar navigation with overview stats_

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite 8 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| State Management | Zustand |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Internationalization | react-i18next |
| Backend / Auth / DB | Supabase (PostgreSQL + RLS) |
| Payments | Razorpay (integration ready) |
| Deployment | Vercel / Netlify |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **npm** v9+

### 1. Clone the Repository

```bash
git clone https://github.com/SwanandDixit/Elev8.git
cd Elev8
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY=your_razorpay_key
```

> **Note**: Without Supabase credentials, the app auto-enables **Demo Mode** — all features remain fully explorable without any backend.

### 4. Run Development Server

```bash
npm run dev
```

Visit **http://localhost:5173**

### 5. Build for Production

```bash
npm run build
```

---

## 📂 Project Structure

```
Elev8/
├── public/
│   ├── locales/
│   │   ├── en.json          # English translations
│   │   ├── hi.json          # Hindi translations
│   │   └── mr.json          # Marathi translations
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── jobs/
│   │   │   └── JobCard.tsx         # Job listing card with apply/save/share
│   │   ├── layout/
│   │   │   ├── Layout.tsx          # Page layout wrapper
│   │   │   ├── Navbar.tsx          # Responsive navigation bar
│   │   │   ├── Footer.tsx          # Multi-column footer
│   │   │   └── MobileBottomNav.tsx # Mobile bottom tab bar
│   │   ├── ui/
│   │   │   └── LanguageSwitcher.tsx # EN/HI/MR toggle component
│   │   └── workers/
│   │       └── WorkerCard.tsx      # Worker profile card
│   ├── lib/
│   │   ├── i18n.ts           # i18n configuration
│   │   ├── mockData.ts       # Development mock data
│   │   └── supabase.ts       # Supabase client
│   ├── pages/
│   │   ├── Home.tsx          # Landing page
│   │   ├── FindWork.tsx      # Job search & listings
│   │   ├── BrowseWorkers.tsx # Worker directory
│   │   ├── WorkerProfile.tsx # Individual worker profile
│   │   ├── PostRequirement.tsx  # 3-step job posting form
│   │   ├── RegisterWorker.tsx   # 4-step worker registration
│   │   ├── Certifications.tsx   # Skill verification system
│   │   ├── About.tsx         # Mission, team, timeline
│   │   ├── SignIn.tsx        # Login page
│   │   ├── SignUp.tsx        # Registration with role toggle
│   │   ├── ForgotPassword.tsx
│   │   ├── WorkerDashboard.tsx  # Worker portal
│   │   ├── EmployerDashboard.tsx # Employer portal
│   │   └── AdminPanel.tsx    # Admin control panel
│   ├── store/
│   │   └── authStore.ts      # Zustand auth state + demo mode
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── App.tsx               # Routes + protected route guards
│   ├── main.tsx              # Entry point
│   └── index.css             # Global design system CSS
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🗺️ Pages Overview

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, stats, categories, testimonials |
| `/find-work` | Find Work | Search + filter job listings |
| `/browse-workers` | Browse Workers | Worker directory with filters |
| `/worker/:id` | Worker Profile | Full profile with reviews |
| `/post-requirements` | Post Requirement | 3-step posting (business/household) |
| `/register-worker` | Join as Worker | 4-step registration flow |
| `/certifications` | Certifications | Skill verification system |
| `/about` | About Elev8 | Mission, values, team |
| `/sign-in` | Sign In | Email + Google OAuth |
| `/sign-up` | Sign Up | Worker / Employer role selection |
| `/dashboard/worker` | Worker Dashboard | Applications, saved jobs, messages |
| `/dashboard/employer` | Employer Dashboard | Listings, applicants management |
| `/admin` | Admin Panel | User management, cert queue, flags |

---

## 🏗️ Architecture & Scalability

```
┌─────────────────────────────────────────┐
│              React Frontend             │
│   Vite + TypeScript + Tailwind CSS v4   │
│   Zustand (state) + React Router v6     │
└──────────────────┬──────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────┐
│           Supabase Backend              │
│  PostgreSQL DB + Row Level Security     │
│  Supabase Auth + Google OAuth           │
│  Supabase Realtime (messaging)          │
└─────────────────────────────────────────┘
```

- **Horizontal scaling**: Supabase handles DB connections via PgBouncer
- **CDN deployed**: Static assets on Vercel Edge Network
- **RLS enforced**: Every DB query scoped to authenticated user
- **i18n lazy loading**: Translation files loaded on demand

---

## 🔒 Security

- **Row Level Security (RLS)** on all Supabase tables
- **JWT-based auth** — no passwords stored client-side
- **Protected routes** with role-based access control
- **No contact info in job descriptions** (enforced via UI warning)
- **Environment variables** — credentials never committed to source

---

## 🌍 Real-World Impact

- 🎯 **Target users**: 500M+ blue-collar workers across India
- 💰 **Economic uplift**: Eliminating middlemen saves workers 40–60% commission
- 📱 **Accessibility**: Works on low-end Android devices via mobile-first design
- 🌐 **Language inclusion**: Hindi + Marathi support covers 400M+ speakers
- ✅ **Trust**: Skill verification increases employer confidence and worker pay

---

## 👨‍💻 Team

**Built by Swanand Dixit** for the hackathon — combining a real market need with modern web engineering to create a platform that dignifies India's skilled workforce.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
