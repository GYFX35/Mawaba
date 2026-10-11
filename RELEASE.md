# Release Notes: Mawaba v1.4.0 🚀

We are thrilled to announce **Mawaba Version 1.4.0**, bringing platform-wide version upgrades, enhanced AI service fallback mechanisms, dependency alignment across monorepo workspaces, and performance optimizations!

Mawaba connects global health, AI tutoring, climate solutions, environmental protection, cultural heritage archives, DTC e-commerce, venture capital networks, sustainable agribusiness, videos hub, and browser gaming tools into a unified digital ecosystem.

---

## What's New & Improved in v1.4.0

### 1. 🚀 Next-Generation Workspace & Version Bumping
- Upgraded monorepo package versions across root (`package.json`), frontend (`apps/frontend/package.json`), and backend (`apps/backend/package.json`) to **v1.4.0**.
- Synchronized workspace lockfiles (`package-lock.json`) and verified complete dependency tree integrity.

### 2. 🎨 Platform Brand & Interface Synchronization
- Updated header (`Navbar.tsx`) and footer (`Footer.tsx`) badges to showcase active version **v1.4.0**.
- Refreshed Homepage (`/`) and About Page (`/about`) with v1.4.0 release highlights and ecosystem milestones.
- Updated root `README.md` and repository documentation.

### 3. ⚡ AI Service & REST API Robustness
- Verified multi-provider AI tutor routing (`/api/ai/tutor`) with fallback simulations for offline/non-API key environments.
- Maintained unit test coverage across Express endpoints and Python AI service execution (`apps/ai-service`).

---

## Getting Started

### Installation
Clone the repository and install workspace dependencies:
```bash
git clone https://github.com/GYFX35/Mawaba.git
cd Mawaba
npm install
```

### Run Backend REST API Server
```bash
npm run dev --workspace=backend
```
The REST API server will run on [http://localhost:3001](http://localhost:3001).

### Run Next.js Frontend Client
```bash
npm run dev --workspace=frontend
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Unit Tests & Health Checks
```bash
# Backend Jest Tests
npm test --workspace=backend

# Python AI Service Unit Tests
PYTHONPATH=apps/ai-service python3 -m unittest apps/ai-service/test_main.py
```

### Build Production Export
```bash
npm run build --workspace=frontend
npm run build --workspace=backend
```

---

## Creating the Tag and Release on GitHub

To publish this release on GitHub:

```bash
# 1. Create annotated release tag
git tag -a v1.4.0 -m "Mawaba Version 1.4.0 Release"

# 2. Push tags to GitHub
git push origin main --tags
```
