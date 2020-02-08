#!/bin/sh

echo "Starting up webserver"

cd data

RUST_BACKTRACE=1 \
../webpage
