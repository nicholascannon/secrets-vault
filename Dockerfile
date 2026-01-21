FROM node:24.11.0-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/server/package.json ./packages/server/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/*/node_modules ./packages/*/node_modules

COPY package.json package-lock.json* ./
COPY packages ./packages
COPY tsconfig.json* ./
COPY vite.config.ts* ./packages/frontend/
COPY vitest.config.ts* ./
COPY biome.json ./

RUN npm run lint
RUN npm run build
RUN npm test

FROM base AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/server/package.json ./packages/server/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci --omit=dev --workspaces --ignore-scripts

COPY --from=builder /app/packages/frontend/dist ./packages/frontend/dist
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

USER node

CMD ["node", "packages/server/dist/main.js"]
