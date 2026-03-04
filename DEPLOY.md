# 4U Revamp – Vercel Deployment Guide

This is the **new 4U UI** (V0-built), deployed separately from the legacy 4U app on Netlify.

## Prerequisites

1. **Backend on Railway** – The Dashboard and other features need the backend with the new routes. Deploy `4u-backend` to Railway first (see Backend section below).
2. **GitHub account** – For connecting the repo to Vercel.

## Deploy to Vercel

### 1. Push to GitHub

If the repo remote is still a placeholder, create a new repo on GitHub and update the remote:

```bash
cd "/Users/papichoo/Documents/4U Revamp"
git remote set-url origin https://github.com/YOUR_USERNAME/4u-revamp.git
git add .
git commit -m "Prepare for Vercel deployment"
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub).
2. Click **Add New** → **Project**.
3. Import the `4u-revamp` repository.
4. Vercel will detect Next.js; keep the defaults.
5. **Root Directory**: leave as `.` (project root).
6. **Environment Variables**: none required (API is proxied via rewrites).
7. Click **Deploy**.

### 3. Post-deploy

- The app will be available at `https://your-project.vercel.app`.
- Production API calls are proxied to `https://4u-backend-production.up.railway.app`.

---

## Backend (Railway)

For the Dashboard and other new features to work in production, the backend must include the new routes.

### Deploy backend changes to Railway

```bash
cd ~/4u-backend
git add .
git commit -m "Add /api/dashboard/requests and /api/dashboard/pitches"
git push origin main
```

If Railway is connected to the repo, it will redeploy automatically. Otherwise, trigger a deploy from the Railway dashboard.

---

## Summary

| App        | Platform | URL                          |
|-----------|----------|------------------------------|
| 4U Revamp (new) | Vercel   | `https://your-project.vercel.app` |
| Legacy 4U      | Netlify  | (existing)                   |
| Backend        | Railway  | `https://4u-backend-production.up.railway.app` |
