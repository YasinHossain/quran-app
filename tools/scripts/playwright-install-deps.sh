#!/usr/bin/env bash
set -euo pipefail

if ! command -v npx >/dev/null 2>&1; then
  echo "npx not found. Install Node.js dependencies first." >&2
  exit 1
fi

if [[ "$(id -u)" -eq 0 ]]; then
  npx playwright install-deps
  exit 0
fi

if command -v sudo >/dev/null 2>&1; then
  # `sudo` often resets PATH (secure_path), which can hide `node`/`npx` when they
  # come from nvm/volta. Preserve the current PATH explicitly.
  sudo env "PATH=$PATH" npx playwright install-deps
  exit 0
fi

echo "Cannot install Playwright OS dependencies: sudo not available." >&2
echo "Try running inside an environment with sudo (WSL/Linux) or run Chromium-only projects." >&2
exit 1
