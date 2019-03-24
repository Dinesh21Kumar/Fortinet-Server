FROM node:10.9.0-alpine



# Create app directory
WORKDIR /usr/src/app

COPY package.json ./


RUN mkdir logs
RUN npm install
RUN npm install pm2 -g

# Bundle app source
COPY . .

EXPOSE 3000
CMD npm start && pm2 logs
