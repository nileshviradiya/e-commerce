# Stage 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set environment variables for the build (optional)
# Example: ARG REACT_APP_API_URL
# ENV REACT_APP_API_URL $REACT_APP_API_URL

# Build the React app
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:1.25-alpine

# Copy the build output from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Remove default Nginx welcome page
RUN rm /usr/share/nginx/html/index.html

# Copy a custom Nginx configuration (if needed, see next step)
# For now, we'll rely on the default Nginx config which should work for SPA if index.html is present
# For client-side routing, a custom config is often needed.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
