FROM node:16-alpine

WORKDIR /workspace

COPY package.json package-lock.json /workspace/

RUN npm install

COPY . .


RUN npm run build

CMD ["npm", "start"]