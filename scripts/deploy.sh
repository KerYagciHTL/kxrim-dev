#!/bin/sh
# Builds the site and switches yagci.cc to it. Each build becomes releases/<time>/, and `live`
# is a symlink to the current one, so the switch is instant and the old release stays.
#
#   npm run deploy            build, then switch live to the new release
#   sh scripts/deploy.sh back switch live back to the previous release
set -e
cd "$(dirname "$0")/.."

if [ "$1" = "back" ]; then
  prev=$(ls -1d releases/*/ | sort | tail -n 2 | head -n 1)
  [ -n "$prev" ] || { echo "no previous release"; exit 1; }
  ln -sfn "${prev%/}" live
  echo "live -> ${prev%/}"
  exit 0
fi

# the GitHub README pages (public/readme); without GitHub the last ones stay
npm run --silent readme || echo "readme: GitHub not reachable, keeping the last pages"
npx nuxt generate
stamp=$(date +%Y%m%d-%H%M%S)
mkdir -p releases
cp -a .output/public "releases/$stamp"

# serve reads serve.json only at start: restart it when the config changed
old_conf=$( [ -e live/serve.json ] && cat live/serve.json || true )
ln -sfn "releases/$stamp" live
if [ "$old_conf" != "$(cat live/serve.json)" ]; then
  sudo systemctl restart kxrim-web
  echo "kxrim-web restarted (serve.json changed)"
fi

# keep the last five releases
ls -1d releases/*/ | sort | head -n -5 | xargs -r rm -rf
echo "live -> releases/$stamp"
