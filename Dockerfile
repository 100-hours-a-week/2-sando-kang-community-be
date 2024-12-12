# 1. Build Stage
FROM node:22 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

# 2. Production Stage
FROM node:22-slim AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app /usr/src/app

ENV PORT=3000

EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "app.js"]
