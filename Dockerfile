# Use multi-stage builds to optimize the final image size
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy only necessary files for building
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY app/. .
EXPOSE 3000
CMD ["npm", "start"]