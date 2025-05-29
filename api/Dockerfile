ARG NODE_VERSION=22

# ---- Build Stage ----
FROM node:${NODE_VERSION}-alpine AS builder

# Set working directory
WORKDIR /api

# Copy package.json and package-lock.json (or pnpm/yarn lock files)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the entire workspace
COPY . .

# Build the api
RUN npm run build

# Remove node modules to reduce image size
# RUN rm -fr node_modules

# ---- Serve Stage ----
FROM node:22-alpine AS runner

# Copy the built API
COPY --from=builder /api/dist ./dist
COPY --from=builder /api/node_modules ./node_modules

EXPOSE 3001

# Run the application.
CMD ["node", "dist/app.js"]
# CMD ["sleep", "1d"]