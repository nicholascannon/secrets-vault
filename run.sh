#!/bin/bash
set -a
source ./packages/frontend/.env
set +a

docker compose --profile app up --build