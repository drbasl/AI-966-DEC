# ====================================
# Multi-stage Dockerfile for Raqim AI 966
# ====================================

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy frontend source
COPY . .

# Build frontend
RUN pnpm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy server source
COPY server ./server
COPY shared ./shared

# Build backend (already done by frontend-builder)
COPY --from=frontend-builder /app/dist ./dist

# Stage 3: Production Image
FROM node:20-alpine AS production

# Install dumb-init (for proper signal handling)
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy built files
COPY --from=frontend-builder --chown=nodejs:nodejs /app/public ./public
COPY --from=backend-builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=backend-builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run app with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
