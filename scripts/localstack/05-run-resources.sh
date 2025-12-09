#!/bin/bash
set -euo pipefail

# Ensure the Python bootstrap runs via a shell wrapper for compatibility with LocalStack's init runner.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

exec /usr/bin/env python3 "${SCRIPT_DIR}/10-setup-resources.py"
