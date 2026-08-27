# Mawaba Tencent Cloud Deployment Guide 🚀

This document details how to publish and deploy the **Mawaba** platform on **Tencent Cloud (腾讯云)**, including automated **Pull Request Preview Deployments** and production releases.

---

## Architecture Overview

Mawaba's Tencent Cloud deployment pipeline supports multiple Tencent Cloud deployment targets:

1. **Tencent Cloud Object Storage (COS) & WEBify**: Hosts the Next.js static export frontend (`apps/frontend/out`).
2. **Tencent Cloud Serverless Cloud Function (SCF)**: Hosts the Express Node.js REST API backend (`apps/backend`).
3. **Tencent Cloud Container Registry (TCR) & TKE/CVM/Lighthouse**: Containerized deployments via Docker and `docker-compose.yml`.

---

## Prerequisites

Before setting up automated GitHub Actions deployments, ensure you have:

1. A **Tencent Cloud Account** ([tencent.com](https://cloud.tencent.com/)).
2. An **API Key Pair** (`SecretId` and `SecretKey`) created under Tencent Cloud CAM (Cloud Access Management).
3. A **Tencent Cloud COS Bucket** (e.g. `mawaba-1250000000` in region `ap-guangzhou`).

---

## Configuring GitHub Repository Secrets

In your GitHub repository, navigate to **Settings > Secrets and variables > Actions** and add the following repository secrets:

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `TENCENTCLOUD_SECRET_ID` | Tencent Cloud API Secret ID | `AKIDz8890123...` |
| `TENCENTCLOUD_SECRET_KEY` | Tencent Cloud API Secret Key | `px90123abcdef...` |
| `TENCENT_COS_BUCKET` | Tencent Cloud COS Bucket Name | `mawaba-1250000000` |
| `TENCENT_COS_REGION` | Tencent Cloud COS Bucket Region | `ap-guangzhou` |

---

## Automated Pull Request Deployments

Whenever a **Pull Request (PR)** is opened or updated in the repository, the GitHub Actions workflow (`.github/workflows/tencent-cloud-deploy.yml`) automatically triggers:

1. **Validation & Testing**: Lints and runs test suites across Frontend, Backend, and AI Service.
2. **Build**: Compiles Next.js static output and TypeScript backend code.
3. **Tencent Cloud Upload**: Uploads the PR preview build to Tencent Cloud COS at:
   ```text
   https://<bucket>.cos.<region>.myqcloud.com/previews/pr-<PR_NUMBER>/index.html
   ```
4. **PR Feedback Comment**: Posts an automated comment directly on the Pull Request containing the live Tencent Cloud preview link.
5. **Auto-Cleanup**: When the Pull Request is closed or merged, the workflow automatically removes the preview deployment from Tencent Cloud COS.

---

## Production Deployment

Pushes to `main` or `master` branches automatically deploy the production version of the frontend to the root of your Tencent Cloud COS bucket and deploy backend APIs to Tencent Cloud SCF / WEBify.

---

## Manual Deployment Options

### Option 1: Serverless Framework (SCF)
Deploy frontend and backend using the Tencent Cloud Serverless Framework:

```bash
# Install Serverless Framework globally
npm install -g serverless

# Build project artifacts
npm run build --workspace=frontend
npm run build --workspace=backend

# Deploy to Tencent Cloud
serverless deploy --target=tencent
```

### Option 2: Docker / Container Deployment (CVM / TKE / Lighthouse)
To run Mawaba using Docker on a Tencent Cloud CVM instance or Lighthouse server:

```bash
# Build and run containers
docker-compose up -d --build
```

---

## Verification & Monitoring

- Check active deployments in the **Tencent Cloud Console** under **COS**, **Serverless SCF**, or **TKE**.
- Monitor GitHub Actions runs under the **Actions** tab in the repository.
