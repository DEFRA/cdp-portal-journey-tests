#!/bin/sh

export AWS_ENDPOINT_URL=http://localhost:4566

# Create the stack
aws cloudformation create-stack \
  --stack-name bootstrap-stack \
  --template-body file://resources.yaml \
  --debug

aws sns subscribe --topic-arn arn:aws:sns:eu-west-2:000000000000:cdp_workflow_events --protocol sqs --notification-endpoint http://localhost:4566/000000000000/cdp_workflow_events
aws sns subscribe --topic-arn arn:aws:sns:eu-west-2:000000000000:deploy-topic --protocol sqs --notification-endpoint http://localhost:4566/000000000000/deployments-from-portal
aws sns subscribe --topic-arn arn:aws:sns:eu-west-2:000000000000:cdp-notification --protocol sqs --notification-endpoint http://localhost:4566/000000000000/cdp-notification
aws sns subscribe --topic-arn arn:aws:sns:eu-west-2:000000000000:cdp-notification --protocol sqs --notification-endpoint http://localhost:4566/000000000000/stub-slack-messages
aws sns subscribe --topic-arn arn:aws:sns:eu-west-2:000000000000:secret_management --protocol sqs --notification-endpoint http://localhost:4566/000000000000/secret_management_updates
aws sns subscribe --topic-arn arn:aws:sns:eu-west-2:000000000000:secret_management --protocol sqs --notification-endpoint http://localhost:4566/000000000000/secret_management_updates_lambda
aws sns subscribe --topic-arn arn:aws:sns:eu-west-2:000000000000:run-test-topic --protocol sqs --notification-endpoint http://localhost:4566/000000000000/run-test-from-portal
aws sns subscribe --topic-arn arn:aws:sns:eu-west-2:000000000000:run-migrations-topic --protocol sqs --notification-endpoint http://localhost:4566/000000000000/run-migrations-from-portal

aws s3 cp --recursive ./assets/cdp-documentation/ s3://cdp-documentation
aws s3 cp ./assets/migrations.tgz s3://cdp-migrations/cdp-postgres-service/0.1.0/migrations.tgz
aws s3 cp ./assets/migrations.tgz s3://cdp-migrations/cdp-postgres-service/0.2.0/migrations.tgz

echo READY > /tmp/READY
