# Identity Reconciliation

## Project Run 
```bash
$ bash project_run.sh
```
- The above command creates a .env file and executes `docker compose up`. It will spin up the API server and the database. 
- The Api Server runs on port `4000`

## Contact Identify endpoint
POST - `http://localhost:4000/api/contacts/identify` 
Sample Curl : 
```bash
curl --location 'http://localhost:4000/api/contacts/identify' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test@test.com",
    "phoneNumber": "+912837483849"
}'
```

## Installation

```bash
$ npm install
```

## Start docker container

```bash
$ npm run database
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
