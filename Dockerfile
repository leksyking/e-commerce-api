FROM node:18.3.0


RUN mkdir /build

WORKDIR /build

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]