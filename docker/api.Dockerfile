FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/package.json ./
RUN yarn install --production --frozen-lockfile
USER nodejs
EXPOSE 3001
CMD ["node", "dist/server.js"]