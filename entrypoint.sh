#!/bin/sh

echo "run_id: $RUN_ID"
if [ -n "$PROFILE" ]; then
  echo "Running npm test:$PROFILE..."
  npm run "test:$PROFILE"
else
  echo "Running npm test..."
  npm test
fi
test_exit_code=$?

npm run report:publish
publish_exit_code=$?

if [ $publish_exit_code -ne 0 ]; then
  echo "failed to publish test results"
  exit $publish_exit_code
fi

exit $test_exit_code
