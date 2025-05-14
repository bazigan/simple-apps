FROM node:18.20.8-slim
WORKDIR /app
ADD . /app/
RUN npm install -g
CMD [ "npm start" ]