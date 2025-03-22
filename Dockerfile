# Use Node.js LTS (Long Term Support) as base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port your app runs on (adjust as needed)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/index.js"] 