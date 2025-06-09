FROM node:20

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the TypeScript code
RUN npm run build

# Set environment variables
ENV NODE_ENV=production

# Run the application
CMD ["node", "dist/src/index.js"]
