# Université CEFAT International

Site institutionnel léger et autonome de **Université CEFAT International**.

## Lancer localement

Depuis la racine du monorepo :

```bash
python3 -m http.server 8092 --directory apps/universite-cefat-international
```

Puis ouvrir <http://127.0.0.1:8092>.

Le site n'a aucune dépendance de compilation : `index.html`, `styles.css` et `app.js` peuvent être déployés directement sur un hébergement statique.
