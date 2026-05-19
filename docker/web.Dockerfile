FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock ./
COPY apps/web/package.json ./
RUN yarn install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn workspace @askit/web build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/.next ./.next
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/package.json ./
COPY --from=deps /app/node_modules ./node_modules
RUN yarn install --production --frozen-lockfile
USER nodejs
EXPOSE 3000
CMD ["yarn", "workspace", "@askit/web", "start"]