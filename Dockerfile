# Create image based on the official Node image from dockerhub
FROM node:14-alpine AS development
# Create a directory where our app will be placed
RUN mkdir -p /ramp-up/frontend/src/app
# Change directory so that our commands run inside this new directory
WORKDIR /ramp-up/frontend/src/app
# Copy dependency definitions
COPY package.json /ramp-up/frontend/src/app
# Install dependecies
RUN npm install
# Get all the code needed to run the app
COPY . /ramp-up/frontend/src/app
# Expose the port the app runs in
EXPOSE 4200
# Serve the app
CMD ["npm", "start"]
