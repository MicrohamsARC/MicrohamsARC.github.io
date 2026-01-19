# MicroHAMS CI Container - Multi-stage build for efficiency
# 
# Uses official images for speed and reliability:
# - node:24-slim for unit tests and builds (~150MB)
# - mcr.microsoft.com/playwright for E2E (~1.5GB but pre-built)
#
# Stages:
# 1. deps: Install node_modules (cached by package-lock.json hash)
# 2. runtime: Unit tests, type-check, lint, build
# 3. e2e: Playwright tests with pre-installed browsers
# 4. dev: Local development with hot reload

# =============================================================================
# Stage 1: Dependencies installation
# Uses BuildKit cache mount for fast rebuilds
# =============================================================================
FROM node:24-slim AS deps

WORKDIR /deps

# Copy only package files for dependency installation
COPY package.json package-lock.json ./

# Install dependencies with npm cache mount for speed
RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

# =============================================================================
# Stage 2: Runtime - unit tests, type-check, lint, build
# Lightweight image without browser dependencies
# =============================================================================
FROM node:24-slim AS runtime

WORKDIR /workspace

# Install git (needed for some operations)
RUN apt-get update && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

# Copy node_modules from deps stage
COPY --from=deps /deps/node_modules ./node_modules

# Create test results directories
RUN mkdir -p test-results/vitest test-results/playwright

# Default command runs CI pipeline
CMD ["npm", "run", "ci"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node --version || exit 1

# =============================================================================
# Stage 3: E2E - Playwright with pre-installed Chromium
# Uses official Microsoft Playwright image (includes Node 22 + browsers)
# =============================================================================
FROM mcr.microsoft.com/playwright:v1.57.0-noble AS e2e

WORKDIR /workspace

# Copy node_modules from deps stage
COPY --from=deps /deps/node_modules ./node_modules

# Create test results directory
RUN mkdir -p test-results/playwright

# Run Playwright tests
CMD ["npx", "playwright", "test"]

# =============================================================================
# Stage 4: Dev - for local development with hot reload
# =============================================================================
FROM node:24-slim AS dev

WORKDIR /workspace

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl git \
    && rm -rf /var/lib/apt/lists/*

# Copy node_modules from deps stage
COPY --from=deps /deps/node_modules ./node_modules

# Expose dev server port
EXPOSE 4321

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
