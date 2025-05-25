# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Copy .env.local (for MongoDB & JWT_SECRET)
COPY .env.local .env.local

# Build the Next.js app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Run Next.js in production
CMD ["npm", "start"]
