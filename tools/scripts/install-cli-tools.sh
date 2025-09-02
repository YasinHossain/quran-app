#!/usr/bin/env bash
set -euo pipefail

echo "Installing CLI tools (ripgrep, fd, jq, tree)..."

if command -v apt-get >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo apt-get install -y ripgrep fd-find jq tree
  # Ubuntu/Debian may install fd as fdfind; create a convenient alias
  if command -v fdfind >/dev/null 2>&1 && ! command -v fd >/dev/null 2>&1; then
    sudo ln -sf "$(command -v fdfind)" /usr/local/bin/fd || true
  fi
elif command -v brew >/dev/null 2>&1; then
  brew update
  brew install ripgrep fd jq tree
else
  echo "Package manager not detected (apt-get/brew). Skipping system install."
  echo "You can still use project-local ripgrep via: npm run rg -- ..."
fi

echo "Done."

