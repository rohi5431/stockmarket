FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000 7000

# Default start command
CMD ["node", "src/server.js"]