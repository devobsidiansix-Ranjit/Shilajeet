FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# We use --legacy-peer-deps and omit development dependencies for production
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Bundle app source
COPY . .

# Expose backend port
EXPOSE 5000

# Start production server
CMD ["npm", "start"]
