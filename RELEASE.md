# Release Notes: Mawaba v1.0.0 🚀

We are proud to announce the **first official release (v1.0.0)** of the **Mawaba** Global Interaction & AI-Driven Business platform!

Mawaba is designed to empower global innovation, world development, health, and education through high-quality UI/UX and advanced AI service integrations. This release lays the foundation of Mawaba's client application and sets up continuous deployment workflows.

---

## What's New in v1.0.0

### 1. 🎓 Next-Generation Global Education Platform
We have developed a comprehensive Global Education module (`/education`) that brings high-quality academic disciplines to learners across the globe without boundaries:
- **STEM & Sciences:** Curriculum covering quantum mechanics, physics, biology, and chemistry.
- **Literature & Languages:** Global communication, creative writing, and multilingual content.
- **Business & Economics:** Sustainable development goals, entrepreneurship, and financial literacy.
- **World Development:** Climate tech, green energy, public health, and social equity.
- **Interactive AI Tutor Mock Workspace:** Ask questions on any topic and receive simulated real-time, context-specific tutor support.
- **Peer-to-Peer Forums:** Active discussion rooms connecting emergent learners with university networks.

### 2. ⚖️ MIT Open Source License Integration
Mawaba is now officially licensed under the **MIT License** to support global open collaboration:
- Added root `LICENSE` file.
- Updated root, frontend, and backend `package.json` files to specify `MIT` license.
- Created `/license` frontend page containing the complete MIT legal terms with responsive styling.
- Linked MIT license in footer under Legal.

### 3. 🌐 Automated GitHub Pages & Continuous Deployment
Set up and optimized static HTML builds for serverless hosting:
- Configured Next.js static exports (`output: 'export'`) inside `next.config.js`.
- Enabled `NEXT_PUBLIC_BASE_PATH` environment variable support to automatically prepend `/Mawaba` when running in GitHub production environments.
- Created GitHub Actions workflow `.github/workflows/deploy.yml` to automatically build, package, and deploy our Next.js frontend to **GitHub Pages** on every push to `main` branch.

---

## Getting Started

### Installation
Clone the repository and install workspace dependencies:
```bash
git clone https://github.com/GYFX35/Mawaba.git
cd Mawaba
npm install
```

### Run Frontend Locally
```bash
npm run dev
```

### Build Static Export (GitHub Pages Format)
```bash
npm run build
```
This produces an optimized static export inside `apps/frontend/out/` directory, ready to be hosted on GitHub Pages or any static CDN.

---

## Creating the Tag and Release on GitHub

To push this release to GitHub, you can execute the following Git commands in your terminal:

```bash
# 1. Tag the commit
git tag -a v1.0.0 -m "Mawaba Version 1.0.0 First Release"

# 2. Push the branch and tags
git push origin main --tags
```

Once pushed, navigate to the **Releases** tab on your GitHub repository page, choose "Draft a new release", select the tag `v1.0.0`, paste this `RELEASE.md` content into the release notes, and click **Publish Release**!
