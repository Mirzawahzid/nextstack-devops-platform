# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# ── Stage 2: Production image ──────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -S nextstack && adduser -S nextstack -G nextstack

COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Set ownership
RUN chown -R nextstack:nextstack /app

USER nextstack

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/healthz || exit 1

CMD ["node", "server.js"]
