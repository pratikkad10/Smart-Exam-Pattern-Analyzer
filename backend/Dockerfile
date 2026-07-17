FROM node:24-alpine

# Install openssl for Prisma query engine support on Alpine Linux
RUN apk add --no-cache openssl

# Set environment to production for performance optimizations
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Change ownership of the app directory to the non-root 'node' user
RUN chown node:node /app

# Switch to the non-root 'node' user for security
USER node

# Copy package files and ensure correct ownership
COPY --chown=node:node package*.json ./

# Install only production dependencies for a smaller, cleaner image
RUN npm ci --omit=dev --legacy-peer-deps

# Copy the rest of the application code
COPY --chown=node:node . .

# Generate Prisma Client (must run after source code is copied)
RUN npx prisma generate

EXPOSE 5000

# Run the app directly using node instead of npm for better signal handling (graceful shutdowns)
CMD ["node", "src/server.js"]
