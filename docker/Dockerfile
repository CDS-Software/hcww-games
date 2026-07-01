FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
