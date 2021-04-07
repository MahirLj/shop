# Dockerfile
# Pull official Node.js image from Docker Hub
FROM node:10.9.0
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install dependencies
COPY package*.json /usr/src/app/
RUN npm install
# Bundle app source
COPY . .
# Expose container port 3000
EXPOSE 3000
# Run "start" script in package.json
CMD ["npm", "start"]