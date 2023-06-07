FROM node:20-alpine3.16 as builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn prisma generate
RUN yarn run build

FROM node:20-alpine3.16 as deploy
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD [ "node", "dist/src/main.js" ]
