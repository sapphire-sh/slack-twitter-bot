#!/bin/bash

set -ex

docker-compose build && \
docker-compose down --remove-orphans && \
docker-compose up -d --remove-orphans
