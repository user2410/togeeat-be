# Togeeat backend API

## Description
Backend API of Togeeat web app

## Installation
- Dependencies: `npm install` or `yarn install`
- Fill environment fields in '.env' file
- Run `npx prisma generate` or `yarn prisma generate` to generate prisma client
- Run `npx prisma migrate dev` or `yarn prisma migrate dev` to apply migrations


## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

