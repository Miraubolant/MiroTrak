FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create a temporary .env file for build (will be replaced by environment variables at runtime)
RUN echo "TZ=UTC" > .env && \
    echo "PORT=3333" >> .env && \
    echo "HOST=0.0.0.0" >> .env && \
    echo "LOG_LEVEL=info" >> .env && \
    echo "APP_KEY=temp_key_for_build_only" >> .env && \
    echo "NODE_ENV=production" >> .env && \
    echo "DB_HOST=postgres" >> .env && \
    echo "DB_PORT=5432" >> .env && \
    echo "DB_USER=postgres" >> .env && \
    echo "DB_PASSWORD=postgres" >> .env && \
    echo "DB_DATABASE=gestion_clients" >> .env

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3333

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 adonisjs

COPY --from=builder --chown=adonisjs:nodejs /app/build ./
COPY --from=deps --chown=adonisjs:nodejs /app/node_modules ./node_modules

USER adonisjs

EXPOSE 3333

CMD ["node", "bin/server.js"]
