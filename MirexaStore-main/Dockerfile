# 1️⃣ Build stage
FROM node:20-alpine AS builder

# Working directory
WORKDIR /app

# Package.json + package-lock.json copy
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend source code
COPY . .

# Build Next.js project
RUN npm run build

# 2️⃣ Production stage
FROM node:20-alpine

# Working directory
WORKDIR /app

# Copy built files + node_modules from builder
COPY --from=builder /app ./

# Expose port 3000
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Start Next.js
CMD ["npm", "start"]
