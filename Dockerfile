FROM node:18.20.8-bullseye-slim
WORKDIR /app
ADD . /app/
RUN npm install
CMD [ "npm", "start" ]