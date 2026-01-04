# syntax=docker/dockerfile:1
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
# Note: npm ci has a known bug with Docker BuildKit that shows "Exit handler never called" 
# but still installs packages successfully. We check for tsc to verify.
RUN npm ci && test -f node_modules/.bin/tsc || (echo "Dependencies failed to install" && exit 1)

# Copy source files
COPY tsconfig.json ./
COPY src ./src

# Build the application
RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built files from build stage
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
