# This is only used to run migrations locally.
FROM node:24.11.0-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/server/package.json ./packages/server/
COPY packages/server/prisma.config.ts ./packages/server/
COPY packages/server/prisma ./packages/server/prisma

COPY packages/shared/package.json ./packages/shared/

RUN npm ci --workspace=@secrets-vault/server --include-workspace-root

WORKDIR /app/packages/server

CMD ["npm", "run", "db:deploy"]
