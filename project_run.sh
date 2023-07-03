#!/bin/bash

text=$(cat << EOF
NODE_ENV = development
DB_HOST = localhost
DB_PORT = 5432
DB_USER = postgres
DB_PASSWORD = password123
DB_NAME = postgres
PORT = 4000
EOF
)
env_file=".env"

# Copy the text to the .env file
echo "$text" > "$env_file"

docker compose up
