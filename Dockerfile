FROM node:18.20.6-slim
WORKDIR /app
ADD . /app/
RUN npm install
CMD ["npm","start"]
EXPOSE 3000