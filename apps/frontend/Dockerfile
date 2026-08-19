# Dockerfile for Next.js Frontend (AWS ECS / App Runner / S3 static output)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root manifests and workspace package files
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY apps/backend/package*.json ./apps/backend/

RUN npm install

# Copy source code
COPY apps/frontend ./apps/frontend
COPY tsconfig.base.json ./

ENV NEXT_PUBLIC_BASE_PATH=""

# Build static output or standalone Next.js server
RUN npm run build --workspace=frontend

# Production Nginx stage for serving static files on AWS
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/frontend/out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
