# Mawaba

Global interaction,communication app integrated with AI for business,partnership,opinions and development ideas sharing and publishing,opportunities,forums and chatting.This app is so global health,education,well-being,business promotion,world development social network

## Project Structure

This project is a monorepo that contains the following:

- `apps/backend`: The backend application (Node.js)
- `apps/frontend`: The frontend application (Next.js)
- `packages/*`: Shared packages (currently empty)

## Deployment & Publishing Guides 🚀

Mawaba provides automated publishing pipelines and instructions for three major hosting platforms:

1. **GitHub Pages (Frontend)**:
   - Automated via GitHub Actions in `.github/workflows/deploy.yml`.
   - On every push to `main`, Next.js static export (`apps/frontend/out`) is automatically built and deployed.
   - See [RELEASE.md](./RELEASE.md) for tag creation and GitHub release publishing steps.

2. **Amazon Web Services - AWS (Full Stack)**:
   - S3 + CloudFront static CDN hosting for Next.js frontend.
   - Docker containerization for Express Backend (`apps/backend/Dockerfile`) and AI Service (`apps/ai-service/Dockerfile`) for AWS App Runner or ECS.
   - CI/CD workflow template available in `.github/workflows/aws-deploy.yml.template`.
   - Read the complete [AWS Deployment Guide](./AWS_DEPLOYMENT.md).

3. **Notion Workspace Integration**:
   - Publish project updates, ideas, opinions, and educational resources directly to Notion.
   - Use the backend publishing API at `/api/notion/publish`.
   - Read the complete [Notion Integration Guide](./NOTION_INTEGRATION.md).

## Getting Started

To get started, you need to have Node.js and npm installed.

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the frontend application:**

   ```bash
   npm run dev
   ```

   This will start the frontend application on `http://localhost:3000`.

3. **Run the backend application:**

   There is no backend application to run yet. You can start by running the placeholder file:

   ```bash
   npm --workspace=backend exec ts-node src/index.ts
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
