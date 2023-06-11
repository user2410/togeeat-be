FROM node:16.16.0-alpine3.16 as builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN rm prisma/schema.prisma package.json
RUN cp prisma/schema.prisma.deploy  prisma/schema.prisma
RUN cp package.json.deploy package.json
RUN yarn install
RUN yarn prisma generate
RUN yarn run build

FROM node:16.16.0-alpine3.16 as deploy
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD [ "node", "dist/src/main.js" ]