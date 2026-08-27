# Dockerfile for Mawaba Backend REST API
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
RUN npm install

COPY apps/backend ./apps/backend
RUN npm run build --workspace=backend

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
RUN npm install --only=production

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

EXPOSE 3001
CMD ["node", "apps/backend/dist/index.js"]
