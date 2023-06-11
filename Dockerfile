FROM node:16-alpine3.17 as builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN apk add openssl1.1-compat
RUN yarn install
RUN yarn prisma generate
RUN yarn run build

FROM node:16-alpine3.17 as deploy
WORKDIR /app
RUN apk add openssl1.1-compat
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD [ "node", "dist/src/main.js" ]