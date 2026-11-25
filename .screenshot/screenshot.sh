#!/usr/bin/env bash
# Usage: scripts/screenshot.sh URL {light|dark} WIDTH,HEIGHT
set -euo pipefail

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 URL {light|dark} WIDTH,HEIGHT" >&2
  exit 2
fi

url="$1"
theme="$2"
size="$3"
chrome="${SCREENSHOT_CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

if [ -z "$url" ]; then
  echo "screenshot: URL must not be empty" >&2
  exit 2
fi
case "$theme" in
  light) scheme=1 ;;
  dark) scheme=0 ;;
  *) echo "screenshot: theme must be light or dark" >&2; exit 2 ;;
esac
if [[ ! "$size" =~ ^[0-9]+,[0-9]+$ ]] || [[ "$size" =~ ^0+,|,0+$ ]]; then
  echo "screenshot: size must be WIDTH,HEIGHT with positive integers" >&2
  exit 2
fi
if [ ! -x "$chrome" ]; then
  echo "screenshot: Chrome not executable: $chrome" >&2
  exit 1
fi

root="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$root/screenshots"
"$chrome" \
  --headless \
  "--window-size=$size" \
  --hide-scrollbars \
  --disable-local-storage \
  "--blink-settings=preferredColorScheme=$scheme" \
  "--screenshot=$root/docs/screenshots/screenshot-$theme.png" \
  "$url"
