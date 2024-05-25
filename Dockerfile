# Use the LTS version of Node.js
FROM node:lts

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Copy the environment file
COPY config.env ./

# Build the NestJS application
RUN npm run build

# Expose the port that the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]
