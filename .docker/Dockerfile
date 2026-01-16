# MicroHAMS CI Container - Multi-stage build for efficiency
# Stage 1: Base with system dependencies (rarely changes)
# Stage 2: Dependencies layer (changes on package.json updates)
# Stage 3: Playwright browsers (changes on Playwright version updates)
# Stage 4: Runtime (mounts workspace, uses cached layers)

# =============================================================================
# Stage 1: Base system dependencies
# =============================================================================
FROM ubuntu:22.04 AS base

ENV DEBIAN_FRONTEND=noninteractive \
    NODE_VERSION=20

# Install system dependencies - these rarely change
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    wget \
    ca-certificates \
    gnupg \
    # Playwright/Chromium dependencies
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# =============================================================================
# Stage 2: Dependencies installation
# Only rebuilds when package*.json changes
# =============================================================================
FROM base AS deps

WORKDIR /deps

# Copy only package files for dependency installation
COPY package.json package-lock.json ./

# Install production + dev dependencies
RUN npm ci --include=dev

# =============================================================================
# Stage 3: Playwright browsers
# Only rebuilds when Playwright version changes
# Cached separately because browser download is expensive (~500MB)
# =============================================================================
FROM base AS playwright

# Copy package files to check Playwright version
COPY package.json package-lock.json ./

# Install just Playwright (skip other deps, use cached version check)
RUN npm install @playwright/test && \
    npx playwright install --with-deps chromium && \
    rm -rf node_modules package*.json

# =============================================================================
# Stage 4: Runtime - final image for CI/testing
# =============================================================================
FROM base AS runtime

WORKDIR /workspace

# Copy node_modules from deps stage
COPY --from=deps /deps/node_modules ./node_modules

# Copy Playwright browsers from playwright stage
COPY --from=playwright /root/.cache/ms-playwright /root/.cache/ms-playwright

# Create test results directories
RUN mkdir -p test-results/vitest test-results/playwright

# Default command runs CI pipeline
CMD ["npm", "run", "ci"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node --version || exit 1

# =============================================================================
# Stage 5: Dev - for local development with hot reload
# =============================================================================
FROM runtime AS dev

# Expose dev server port
EXPOSE 4321

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

CMD ["npm", "run", "dev"]
