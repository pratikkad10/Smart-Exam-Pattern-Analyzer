FROM node:18-alpine

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
RUN npm ci --only=production

# Copy the rest of the application code
COPY --chown=node:node . .

EXPOSE 5000

# Run the app directly using node instead of npm for better signal handling (graceful shutdowns)
CMD ["node", "src/server.js"]
