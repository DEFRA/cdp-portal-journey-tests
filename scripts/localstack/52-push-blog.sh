#!/bin/sh

DIRECTORY="$PWD/assets"

echo "Pushing blogs to S3"

if [ -d "$DIRECTORY" ]; then
  aws --endpoint-url=$LOCALSTACK_URL s3 --region $AWS_REGION sync "${DIRECTORY}/cdp-documentation" s3://cdp-documentation/

  echo "Blog articles pushed"
else
  echo "$DIRECTORY is not found"
  exit 1
fi
