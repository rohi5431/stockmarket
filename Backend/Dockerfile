# Use official Node image
FROM node:18

# Create working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project source
COPY . .

# Expose backend ports
EXPOSE 5000
EXPOSE 7000

# Default start command
CMD ["node", "src/server.js"]