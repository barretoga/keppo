# Base stage
FROM node:22-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN apk add --no-cache openssl
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Prune dependencies to keep image size down
RUN npm prune --production

# Production stage
FROM node:22-alpine AS production

WORKDIR /usr/src/app

# Copy built assets from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma

# Start the server using the production build
RUN apk add --no-cache openssl
CMD ["npm", "run", "start:prod"]
