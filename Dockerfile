# 1. Build Stage
FROM node:22 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

# 2. Production Stage (Node.js)
FROM node:22-alpine AS node-app

WORKDIR /usr/src/app

COPY --from=build /usr/src/app /usr/src/app

CMD ["node", "app.js"] 

# 3. Production Stage (Nginx)
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=node-app /usr/src/app/build .

COPY /.platform/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]