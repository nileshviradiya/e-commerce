# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install dependencies
# Using 'ci' for cleaner installs if package-lock.json is present and up-to-date
# Otherwise, 'install' is fine. For production, '--omit=dev' is good.
RUN npm ci --omit=dev

# Bundle app source
COPY . .

# Make port 5000 available to the world outside this container
# Ensure this matches the PORT in your .env or default in app.js
EXPOSE ${PORT:-5000}

# Define environment variable (can be overridden)
ENV NODE_ENV production

# Run the app when the container launches
CMD ["node", "src/app.js"]
