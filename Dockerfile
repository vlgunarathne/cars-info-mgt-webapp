# Use the official Node.js image as the base image
FROM node:18 as build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build --prod

# Use the official NGINX image as the base image for serving the application
FROM nginx:alpine

# Copy the built Angular application from the build stage to the NGINX html directory
COPY --from=build /app/dist/cars-info-mgt-webapp /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
