# Nestjs Template with typeorm 

## Description

This is a template for nestjs with typeorm. It is based on the nestjs cli and 


## Installation

```bash
$ npm install
```

## Start docker container

```bash
$ npm run db:start
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations
```bash
# Create a migration
$ npm run migration:create --name=foo

# Generate a migration from schema changes
$ npm run migration:generate --name=bar

# Run migrations and checks for schema changes
$ npm run migration:run

# Revert migrations
$ npm run migration:revert

```