#!/bin/bash
echo Setting up Notify Backend Secrets

source /etc/localstack/conf.d/local-defaults.env

aws --endpoint-url=$LOCALSTACK_URL secretsmanager --region $AWS_REGION create-secret --name cdp/notify/backend/integration-keys/Platform \
  --secret-string 'abc123def456ghi789jkl012mno345pq'

echo Done!
