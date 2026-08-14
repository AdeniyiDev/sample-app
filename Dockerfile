# Build stage - installs all dependencies (including dev) to run tests/lint
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production stage - only production dependencies, smaller final image
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Run as a non-root user - a basic but important container security practice
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "src/server.js"]
