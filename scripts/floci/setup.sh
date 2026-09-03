#!/bin/sh

# Create the stack
aws cloudformation create-stack \
  --stack-name bootstrap-stack \
  --template-body file://resources.yaml \
  --debug

aws s3 cp --recursive ./assets/cdp-documentation/ s3://cdp-documentation
aws s3 cp --recursive ./assets/cdp-migrations/ s3://cdp-migrations

echo READY > /tmp/READY
