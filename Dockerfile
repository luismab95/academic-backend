# Use the official Node.js image as the build stage
FROM node:22.13.0-bullseye AS build

# Copy all files from the current directory to /app in the container
COPY . /app
# Set the working directory to /app
WORKDIR /app

# Install dependencies
RUN yarn install --ignore-scripts
# Build the application
RUN yarn build

# Use a smaller Node.js image for the production stage
FROM node:22.13.0-slim AS production

# Create a non-root user and set permissions
RUN useradd --user-group --create-home --shell /bin/false appuser \
    && chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Copy the built application from the build stage
COPY --from=build /app/dist/ ./dist/
# Copy node_modules from the build stage
COPY --from=build /app/node_modules/ ./node_modules/
# Copy package.json from the build stage
COPY --from=build /app/package.json ./package.json
# Copy templates from the build stage
COPY --from=build /app/templates/ ./templates/

# Create a directory for keys
RUN mkdir keys

# Set the working directory to /dist
WORKDIR /dist

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start"]


