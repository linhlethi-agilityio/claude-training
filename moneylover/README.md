# Money Lover App

## Overview

This document will overview about estimation for [Next.js Practice](https://docs.google.com/document/d/1eAOdl12x98nnyBqzHQIPnNtFov6x9G13/edit). This practice will build a money management web app.

## Technical stack

- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Features

Build a Web application of Money Lover with features below:

- Authentication
- Onboarding (Currency picker, Wallet creation)
- Wallet list
- Add wallet
- Edit/Delete wallet
- Add/Edit/Delete transaction
- Monthly income & expense summary
- Transaction list grouped by date
- Dashboard (Total balance, Recent transactions)

## Getting Started

To get started with this project, follow the instructions below.

### Prerequisites

- node v20.
- pnpm

### Installation

1. Clone the repository:

```bash
git clone git@gitlab.asoft-python.com:linh.lethi/nextjs-training.git
```

2. Checkout branch:

```bash
git checkout feat/moneylover
```

3. Install dependencies:

```bash
pnpm install
```

### Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run the migration files in `supabase/migrations/`.

### Configure environment variables

Copy the sample file, then fill in the values:

```bash
cp .env.sample .env.local
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required. Without them, `pnpm build` fails with an error that names the missing variables.

### Run the application

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
pnpm run build
pnpm start
```

### Lint

```bash
pnpm run lint
```
