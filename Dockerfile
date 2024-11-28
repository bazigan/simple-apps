FROM node:18.20.5-slim
WORKDIR /app
ADD . /app/
RUN npm install
CMD ["npm","run"]