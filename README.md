# Elev8 — Skill-Based Employment Platform for Blue-Collar Workers in India 🇮🇳

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![i18n Multilingual](https://img.shields.io/badge/Languages-EN%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80%20%7C%20%E0%A4%AE%E0%A4%B0%E0%A4%BE%E0%A4%A0%E0%A5%80-1A56DB)](#-multilingual-system)

**Elev8** is a trustworthy, dignified, mobile-first skill-based employment platform specifically designed for blue-collar workers (electricians, plumbers, carpenters, cooks, cleaners, drivers, security guards, painters, welders, masons, etc.) across India. The platform seamlessly bridges skilled professionals with household and business employers.

---

## 🌟 Key Features

- **🌐 Multilingual Support (Instant Switching)**: 
  - Complete 3-language system: **English (EN)**, **Hindi (HI)**, and **Marathi (MR)**.
  - Instant text re-rendering powered by `react-i18next` with Devanagari font support (`Noto Sans Devanagari`).
- **🔍 Advanced Search & Skill Filtering**:
  - Filter jobs and workers by location, category, pay rate, pay type (hourly, daily, monthly, fixed), and verification status.
- **💼 Household vs. Business Requirements**:
  - Dual posting flow supporting private addresses for household services and corporate details for business jobs.
- **🛡️ Skill Verification & Certifications System**:
  - Integrated certification workflows with partner platforms (NSDC, ITI, Udemy, UpSkill India) and Elev8 practical assessment badges.
- **📱 Mobile-First Responsive Design**:
  - Fully usable on 375px mobile screens up to 4K displays with bottom navigation bar and mobile filter sheets.
- **⚡ Interactive Auth & Demo Mode**:
  - Role-based authentication (Worker / Employer / Admin) with built-in offline demo mode when live Supabase keys are not configured.

---

## 🎨 Design System

- **Primary Color**: Deep Blue `#1A56DB` (Trust & Stability)
- **CTA Accent Color**: Amber `#F59E0B` (Action & Energy)
- **Typography**: `Inter` (English) & `Noto Sans Devanagari` (Hindi / Marathi)
- **Component Style**: Clean cards, 44px thumb-friendly inputs, 8px grid system.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **State & Routing**: Zustand, React Router v6, React Hook Form
- **Internationalization**: `react-i18next`, `i18next-browser-languagedetector`
- **Backend & Database**: Supabase (Auth, Database, RLS)
- **Payments Integration**: Razorpay API Ready

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Elev8.git
   cd Elev8
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
Elev8/
├── public/
│   └── locales/             # i18n JSON files (en.json, hi.json, mr.json)
├── src/
│   ├── components/
│   │   ├── layout/          # Navbar, Footer, MobileNav, Layout
│   │   ├── ui/              # Buttons, Cards, Badges, LanguageSwitcher
│   │   ├── jobs/            # JobCard, JobFilters
│   │   └── workers/         # WorkerCard, WorkerFilters
│   ├── pages/               # All 11 Pages (Home, FindWork, BrowseWorkers, Profile, PostRequirement, RegisterWorker, Certifications, About, SignIn, SignUp, Dashboards, Admin)
│   ├── store/               # Zustand auth & state stores
│   ├── lib/                 # Supabase client, i18n setup, mock data
│   ├── types/               # TypeScript interfaces & types
│   ├── App.tsx              # Router & Protected Route Guards
│   ├── main.tsx             # Entry point
│   └── index.css            # Global CSS & Tailwind imports
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## 📄 License

Distributed under the **MIT License**.
