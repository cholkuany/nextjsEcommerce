# Use official Node.js image as base
FROM node:24-alpine3.22 AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package manager files
COPY package.json pnpm-lock.yaml ./

# Install only dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN pnpm build

# --- Production image ---
FROM node:24-alpine3.22 AS runner

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy only necessary files from build
COPY --from=deps /app/public ./public
COPY --from=deps /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/next.config.js ./next.config.js
COPY --from=deps /app/src ./src

# Set environment variable
ENV NODE_ENV=production
EXPOSE 3000

# Start Next.js server
CMD ["pnpm", "start"]
