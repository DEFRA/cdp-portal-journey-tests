#!/bin/sh

# Create the stack
aws cloudformation create-stack \
  --stack-name bootstrap-stack \
  --template-body file://resources.yaml \
  --debug

aws s3 cp --recursive ./assets/cdp-documentation/ s3://cdp-documentation
aws s3 cp ./assets/migrations.tgz s3://cdp-migrations/cdp-postgres-service/0.1.0/migrations.tgz
aws s3 cp ./assets/migrations.tgz s3://cdp-migrations/cdp-postgres-service/0.2.0/migrations.tgz

echo READY > /tmp/READY
