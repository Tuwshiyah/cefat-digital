#!/bin/bash
# recadrer.sh <source> <destination> <largeur> <hauteur> [qualité]
#
# Recadre en « cover » sans jamais compléter en noir. sips -c ajoute des
# bandes noires dès que la cible dépasse la source : il faut donc choisir
# l'axe de mise à l'échelle selon les proportions, et non au hasard.
set -e
SRC="$1"; DEST="$2"; W="$3"; H="$4"; Q="${5:-80}"
TMP=$(mktemp /tmp/recadre-XXXX.jpg)

SW=$(sips -g pixelWidth  "$SRC" | tail -1 | tr -dc '0-9')
SH=$(sips -g pixelHeight "$SRC" | tail -1 | tr -dc '0-9')

# Source plus large que la cible → on cale sur la hauteur, sinon sur la largeur.
if [ $((SW * H)) -gt $((SH * W)) ]; then
  sips --resampleHeight "$H" "$SRC" --out "$TMP" >/dev/null
else
  sips --resampleWidth  "$W" "$SRC" --out "$TMP" >/dev/null
fi

IW=$(sips -g pixelWidth  "$TMP" | tail -1 | tr -dc '0-9')
IH=$(sips -g pixelHeight "$TMP" | tail -1 | tr -dc '0-9')
if [ "$IW" -lt "$W" ] || [ "$IH" -lt "$H" ]; then
  echo "ERREUR : intermédiaire ${IW}x${IH} plus petit que ${W}x${H} — un recadrage ajouterait du noir" >&2
  rm -f "$TMP"; exit 1
fi

sips -c "$H" "$W" "$TMP" --out "$DEST" >/dev/null
sips -s format jpeg -s formatOptions "$Q" "$DEST" --out "$DEST" >/dev/null
rm -f "$TMP"
printf "  %-34s %sx%s  %s\n" "$(basename "$DEST")" \
  "$(sips -g pixelWidth "$DEST"|tail -1|tr -dc '0-9')" \
  "$(sips -g pixelHeight "$DEST"|tail -1|tr -dc '0-9')" \
  "$(du -h "$DEST"|cut -f1)"
