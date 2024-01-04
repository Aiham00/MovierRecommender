FROM node:16.13.2 

EXPOSE 8040

WORKDIR /spa

COPY package*.json ./

RUN npm install

COPY src src

CMD npm run start 