#!/usr/bin/env bash
# Run frontend tests. Use: npm run test  OR  ./scripts/run-tests.sh
set -e
cd "$(dirname "$0")/.."
npm run test
