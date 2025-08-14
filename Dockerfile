# Use the official Playwright image with all browsers and Node.js
FROM mcr.microsoft.com/playwright:v1.53.2-jammy

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first for faster Docker layer caching
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the entire project
COPY . .

# Set environment variable so Playwright knows it's running in CI
ENV CI=true

# Default command to run Playwright tests and generate HTML report
CMD ["npx", "playwright", "test", "--reporter=html"]
