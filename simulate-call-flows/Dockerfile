# Use the official Node.js image as a base
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Default command to run the script
CMD ["npx", "ts-node", "simulateCallFlows.ts", "50"]