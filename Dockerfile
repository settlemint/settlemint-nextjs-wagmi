# Use an official Bun runtime as a parent image
FROM docker.io/oven/bun:1

# Install Python and other necessary build tools
RUN apt-get update && apt-get install -y python3 make g++

# Set the working directory in the container
WORKDIR /app

# Copy package.json and bun.lockb (if you're using one)
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of your app's source code
COPY . .

# Build your Next.js app
RUN bun run build

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["bun", "start"]

