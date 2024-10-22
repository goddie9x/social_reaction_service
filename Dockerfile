FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production --legacy-peer-deps
COPY . .
EXPOSE 3007
CMD ["npm","start"]