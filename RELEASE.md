# Release Notes: Mawaba v1.1.0 🚀

We are thrilled to announce **Mawaba Version 1.1.0**, featuring a fully unified Next.js frontend and Express TypeScript backend architecture!

Mawaba connects global health, education, climate solutions, environmental protection, cultural heritage archives, e-commerce, and gaming tools into a seamless, accessible digital platform.

---

## What's New in v1.1.0

### 1. 🔗 Fully Unified Frontend & Backend Ecosystem
- Integrated all Next.js client modules with Express TypeScript REST API endpoints on port 3001.
- Centralized base URL resolution via `apps/frontend/components/apiConfig.ts` supporting `NEXT_PUBLIC_API_URL` with seamless fallback for local and production deployment.
- Enhanced CORS configuration (`process.env.CLIENT_ORIGIN`) and 10MB JSON body payload support for media handling.

### 2. 🎮 Gaming Arcade & Developer Monetization Portal (`/games`)
- Playable HTML5 browser games, filtering by genre and monetization model.
- Developer game registration & submission workflow with live 85% revenue split calculation.
- Microtransactions, game purchases, tipping, and developer analytics.

### 3. 🛍️ Direct-to-Consumer (DTC) E-Commerce & Store (`/dtc`)
- Sustainable product catalog browsing, search, and category filtering.
- Interactive cart management, promo code processing, checkout receipt modal, and eco-subscriptions.

### 4. 🌍 Global Culture Archive & Heritage Hub (`/culture`)
- Region and category filtering across global traditions, festivals, and culinary heritage.
- Interactive comment and like systems, camera snapshot capture, and video recording support.

### 5. 🎬 Videos Hub Entertainment Center (`/videos`)
- Multi-category video discovery, HTML5 player playback, like/share/download capabilities, inline commenting, and user video submissions.

### 6. 🌿 Climate Solutions & Eco-Pledges (`/climate`, `/environment`)
- Interactive CO2 impact calculator, renewable initiative upvoting, digital pledge badges, and World Bank Open Data integration.

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

### Run Backend Unit Tests
```bash
npm test --workspace=backend
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
git tag -a v1.1.0 -m "Mawaba Version 1.1.0 Unified Release"

# 2. Push tags to GitHub
git push origin main --tags
```
