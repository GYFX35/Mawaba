# Release Notes: Mawaba v1.2.0 🚀

We are thrilled to announce **Mawaba Version 1.2.0**, bringing significant enhancements to global impact initiatives, investor matching, health promotion, sustainable agriculture, sponsorships, and unified platform services!

Mawaba connects global health, education, climate solutions, environmental protection, cultural heritage archives, e-commerce, investor networks, sustainable agriculture, and gaming tools into a seamless, accessible digital ecosystem.

---

## What's New in v1.2.0

### 1. 💼 Investors & VCs Hub (`/investors`)
- Integrated Venture Capital & Investor Directory with live search and filter capabilities.
- Pitch submission workflow enabling startups and sustainable projects to submit funding requests directly.
- AI-driven investment match proposals and investor analytics dashboard.
- Backend REST endpoints at `/api/investors`, `/api/investors/funding-requests`, and `/api/investors/analytics`.

### 2. 🌾 Sustainable Agriculture & Starvation Alleviation (`/agriculture`)
- Global agriculture project discovery, initiative upvoting, and project funding support.
- Crop yield calculator and AI Agronomist tutor integration.
- Starvation alleviation solutions archive and project proposal tools.
- Backend REST API endpoints at `/api/agriculture/projects` and `/api/agriculture/solutions`.

### 3. 🩺 Global Health Promotion (`/health`)
- Health equity metrics and UN SDG 3 alignment.
- Biometric BMI and daily hydration assessment tool.
- Preventative health tips library with interactive support and community campaign submissions.
- Backend REST API endpoints at `/api/health-promotion/campaigns` and `/api/health-promotion/tips`.

### 4. 💖 Sponsorship & Hall of Fame (`/sponsor`)
- Interactive multi-tier sponsorship platform with custom funding options.
- Support for Stripe, credit/debit, and bank transfer checkout flows.
- Real-time Sponsorship Hall of Fame acknowledging global supporters.
- Backend REST API endpoints at `/api/sponsorship/tiers`, `/api/sponsorship/sponsors`, and `/api/sponsorship/checkout`.

### 5. 🌐 Unified API Platform & Developer Experience
- Enhanced REST API backend in Express & TypeScript (`apps/backend`) with endpoints for all new domains.
- Updated API Docs playground (`/api-docs`) with curling, JavaScript, and Python snippets.
- Streamlined Python AI service (`apps/ai-service`) with Google AI and OpenAI integration support.

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
git tag -a v1.2.0 -m "Mawaba Version 1.2.0 Release"

# 2. Push tags to GitHub
git push origin main --tags
```
