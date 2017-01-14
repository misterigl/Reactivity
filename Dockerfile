# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# node 6.9.4 image
FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app

# Install app dependencies
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000
CMD ["npm", "run", "express"]