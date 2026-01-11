FROM node:16-alpine

WORKDIR /app

# Copy package files from the backend directory
COPY media-app/backend/package*.json ./

RUN npm install

# Copy all backend files
COPY media-app/backend/ .

EXPOSE 5000

CMD ["npm", "start"]