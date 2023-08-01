# Choose the Node.js LTS (Long Term Support) version
FROM node:14-buster-slim

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy the application code to the container
COPY . .

# Expose the application on port 8080
# This is the port that Cloud Run will listen to
EXPOSE 8080

# Run the web service on container startup
CMD [ "npm", "start" ]
