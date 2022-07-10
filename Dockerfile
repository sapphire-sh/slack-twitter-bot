FROM node:alpine

RUN mkdir -p /opt/project
WORKDIR /opt/project

RUN node --version
RUN npm --version

COPY package* ./

RUN npm ci

COPY . .

CMD [ "npm", "start" ]
