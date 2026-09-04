#!/usr/bin/env python3
"""Recalcule l'empreinte des feuilles, scripts et images dans les pages HTML.

Le serveur de développement n'envoie pas d'en-tête Cache-Control : sans
suffixe ?v=, le navigateur garde indéfiniment l'ancienne version et les
corrections restent invisibles. À lancer après toute modification de CSS, de JS ou de photo.
"""
import glob, hashlib, os, re, sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FEUILLES_ET_SCRIPTS = ['assets/css/cefat-custom.css',
                       'assets/js/cefat-i18n.js',
                       'assets/js/cefat-app.js']

os.chdir(RACINE)

def ressources_utilisees():
    """Feuilles, scripts, et toute image locale référencée dans les pages."""
    trouvees = set(FEUILLES_ET_SCRIPTS)
    for page in glob.glob('*.html'):
        contenu = open(page, encoding='utf-8').read()
        for chemin in re.findall(
                r'(?:src|data-still)="(assets/img/[^"?]+)(?:\?v=[0-9a-f]+)?"', contenu):
            trouvees.add(chemin)
    return sorted(c for c in trouvees if os.path.exists(c))

empreintes = {r: hashlib.sha256(open(r, 'rb').read()).hexdigest()[:8]
              for r in ressources_utilisees()}

modifiees = 0
for page in sorted(glob.glob('*.html')):
    src = open(page, encoding='utf-8').read()
    avant = src
    for res, h in empreintes.items():
        src = re.sub(r'(["\'])' + re.escape(res) + r'(?:\?v=[0-9a-f]+)?(["\'])',
                     lambda m, res=res, h=h: f'{m.group(1)}{res}?v={h}{m.group(2)}', src)
    if src != avant:
        open(page, 'w', encoding='utf-8').write(src)
        modifiees += 1

for res, h in empreintes.items():
    print(f'{res:32} {h}')
print(f'{modifiees} page(s) mise(s) à jour')
