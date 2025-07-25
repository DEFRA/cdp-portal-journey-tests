#!/bin/bash
echo Setting up Portal Queues

source /etc/localstack/conf.d/defaults.env

aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name ecs-deployments
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name ecr-push-events
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name github-events
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name cdp_workflow_events

aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name deployments-from-portal
aws --endpoint $LOCALSTACK_URL sns create-topic --region $AWS_REGION --name deploy-topic
aws --endpoint $LOCALSTACK_URL sns subscribe --region $AWS_REGION --topic-arn arn:aws:sns:$AWS_REGION:000000000000:deploy-topic --protocol sqs --notification-endpoint  arn:aws:sqs:$AWS_REGION:000000000000:deployments-from-portal

aws --endpoint $LOCALSTACK_URL sns create-topic --region $AWS_REGION --name cdp-notification
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name cdp-notification
aws --endpoint $LOCALSTACK_URL sns subscribe --region $AWS_REGION --topic-arn arn:aws:sns:$AWS_REGION:000000000000:cdp-notification --protocol sqs --notification-endpoint  arn:aws:sqs:$AWS_REGION:000000000000:cdp-notification

echo Setting up Secrets and Secret Manager lambda
aws --endpoint $LOCALSTACK_URL sns create-topic --region $AWS_REGION --name secret_management
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name secret_management_updates
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name secret_management_updates_lambda
aws --endpoint $LOCALSTACK_URL sns subscribe --region $AWS_REGION --topic-arn arn:aws:sns:$AWS_REGION:000000000000:secret_management --protocol sqs --notification-endpoint  arn:aws:sqs:$AWS_REGION:000000000000:secret_management_updates
aws --endpoint $LOCALSTACK_URL sns subscribe --region $AWS_REGION --topic-arn arn:aws:sns:$AWS_REGION:000000000000:secret_management --protocol sqs --notification-endpoint  arn:aws:sqs:$AWS_REGION:000000000000:secret_management_updates_lambda

echo Setting up Uploader
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name cdp-clamav-results
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name cdp-uploader-scan-results-callback.fifo --attributes "{\"FifoQueue\":\"true\"}"
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name mock-clamav

echo Setting up stub test suite runs
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name run-test-from-portal
aws --endpoint $LOCALSTACK_URL sns create-topic --region $AWS_REGION --name run-test-topic
aws --endpoint $LOCALSTACK_URL sns subscribe --region $AWS_REGION --topic-arn arn:aws:sns:$AWS_REGION:000000000000:run-test-topic --protocol sqs --notification-endpoint  arn:aws:sqs:$AWS_REGION:000000000000:run-test-from-portal

echo Setting up stub migrations
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name run-migrations-from-portal
aws --endpoint $LOCALSTACK_URL sns create-topic --region $AWS_REGION --name run-migrations-topic
aws --endpoint $LOCALSTACK_URL sns subscribe --region $AWS_REGION --topic-arn arn:aws:sns:$AWS_REGION:000000000000:run-migrations-topic --protocol sqs --notification-endpoint  arn:aws:sqs:$AWS_REGION:000000000000:run-migrations-from-portal

echo Setting up CDP Notify
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name cdp_grafana_alerts
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name cdp-notify-github-events
aws --endpoint $LOCALSTACK_URL sqs create-queue --region $AWS_REGION --queue-name stub-slack-messages
aws --endpoint $LOCALSTACK_URL sns create-topic --region $AWS_REGION --name cdp-notification
aws --endpoint $LOCALSTACK_URL sns subscribe --region $AWS_REGION --topic-arn arn:aws:sns:$AWS_REGION:000000000000:cdp-notification --protocol sqs --notification-endpoint  arn:aws:sqs:$AWS_REGION:000000000000:stub-slack-messages

echo Setting up webshell queues
aws --endpoint $LOCALSTACK_URL sns create-topic --region $AWS_REGION --name run-webshell-topic

echo Done!

aws --endpoint $LOCALSTACK_URL sqs --region $AWS_REGION list-queues
aws --endpoint $LOCALSTACK_URL sns --region $AWS_REGION list-topics
