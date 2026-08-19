# AWS Deployment Guide for Mawaba ☁️

This guide outlines step-by-step options for hosting and publishing the Mawaba platform across Amazon Web Services (AWS) infrastructure.

---

## Architecture Overview

Mawaba consists of three micro-services:
1. **Frontend (`apps/frontend`)**: Next.js single-page application configured with static export.
2. **Backend (`apps/backend`)**: Express TypeScript API gateway (`port 3001`).
3. **AI Service (`apps/ai-service`)**: Python AI microservice for intelligent tutor & analytics.

---

## Option A: Frontend Static Deployment via AWS S3 + CloudFront (Recommended)

Because `apps/frontend` is configured for static export (`output: 'export'`), it can be hosted globally with high availability and low latency using AWS S3 and CloudFront CDN.

### 1. Build Frontend Bundle
```bash
npm install
npm run build --workspace=frontend
# Generates static assets in apps/frontend/out/
```

### 2. AWS S3 Bucket Setup
1. Open the **AWS S3 Console** and create a new bucket (e.g., `mawaba-app-frontend`).
2. Uncheck "Block all public access" if serving directly, or set up an **Origin Access Control (OAC)** for CloudFront.
3. Enable **Static Website Hosting** under Bucket Properties, setting `index.html` as both Index and Error documents.

### 3. Deploy via AWS CLI
```bash
aws s3 sync apps/frontend/out/ s3://mawaba-app-frontend --delete
```

### 4. AWS CloudFront CDN Distribution
1. Create a CloudFront Distribution pointing your Origin domain to your S3 bucket website endpoint.
2. Configure HTTP to HTTPS redirection.
3. Create a CloudFront Invalidation after new deployments:
   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

---

## Option B: Containerized Deployment via AWS App Runner / Amazon ECS

Docker container definitions are provided for all three Mawaba services:
- `apps/frontend/Dockerfile`
- `apps/backend/Dockerfile`
- `apps/ai-service/Dockerfile`

### Deploying Backend & AI Service with AWS App Runner

AWS App Runner provides fully managed container execution without needing to manage servers or clusters.

1. **Push Container to Amazon Elastic Container Registry (ECR)**:
   ```bash
   # Authenticate Docker to AWS ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

   # Create repository for backend
   aws ecr create-repository --repository-name mawaba-backend

   # Build and Tag Image
   docker build -t mawaba-backend -f apps/backend/Dockerfile .
   docker tag mawaba-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/mawaba-backend:latest

   # Push Image
   docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/mawaba-backend:latest
   ```

2. **Create App Runner Service**:
   - Go to **AWS App Runner Console** -> **Create Service**.
   - Select **Container Registry** -> **Amazon ECR**.
   - Select your image `mawaba-backend:latest`.
   - Set Port to `3001` (or `8000` for AI Service).
   - Click **Deploy**. AWS App Runner will issue an HTTPS endpoint (e.g., `https://xxxx.us-east-1.awsapprunner.com`).

---

## Option C: Automated AWS Deployment with GitHub Actions

An automated workflow template is provided at `.github/workflows/aws-deploy.yml.template`. To activate it:

1. Copy `.github/workflows/aws-deploy.yml.template` to `.github/workflows/aws-deploy.yml`.
2. Configure the following Repository Secrets in GitHub (`Settings -> Secrets and variables -> Actions`):
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` (e.g. `us-east-1`)
   - `AWS_S3_BUCKET` (e.g. `mawaba-app-frontend`)
   - `AWS_CLOUDFRONT_DISTRIBUTION_ID` (Optional)
3. Every push to `main` will automatically build and deploy the updated platform to AWS!
