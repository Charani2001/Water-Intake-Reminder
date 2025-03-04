# Use Node.js as the base image
FROM node:23

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend source code into the container
COPY . .

# Expose the port React runs on
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]
