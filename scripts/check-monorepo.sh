#!/bin/sh
set -eu

root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

node "$root/scripts/check-static-site.mjs" "$root/apps/les-universites-cefat"
node "$root/scripts/check-static-site.mjs" "$root/apps/college-cefat"
node "$root/scripts/check-static-site.mjs" "$root/apps/universite-cefat-international"

test -f "$root/packages/database/schema.sql"
test -f "$root/packages/contracts/openapi.yaml"
echo "OK: socle partagé"
