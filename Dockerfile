# Use an official Node runtime as the base image
FROM node:20-bullseye

# Install Python and other necessary build tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    make \
    g++ \
    && ln -s /usr/bin/python3 /usr/bin/python

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "start", "--", "-p", "8080"]