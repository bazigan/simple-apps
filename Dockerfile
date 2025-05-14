FROM node:18.20.8-slim
WORKDIR /app
ADD package.json /app/
ADD . /app/
RUN npm install -g
CMD [ "npm start" ]