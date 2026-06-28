#!/bin/bash
# Lakes Linked — one-command deploy
# Run from Terminal: bash deploy.sh
# Or make executable once: chmod +x deploy.sh → then just ./deploy.sh

set -e
cd "$(dirname "$0")"

echo "🚀 Deploying Lakes Linked..."

git add -A
git commit -m "Update $(date '+%Y-%m-%d %H:%M')" || echo "Nothing new to commit."
git push origin main

echo "✅ Done — site will update in ~30 seconds."
