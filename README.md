# CEFAT Digital

Monorepo des sites et services numériques du Groupe CEFAT. Le portail **Les Universités CEFAT** présente le groupe, tandis que chaque établissement conserve son identité, son domaine et son déploiement.

## Applications

| Dossier | Rôle | État |
| --- | --- | --- |
| `apps/les-universites-cefat` | Portail principal du groupe | Actif |
| `apps/college-cefat` | Site du Collège CEFAT | Actif, historique importé |
| `apps/universite-cefat-international` | Site de l'Université CEFAT International | Actif |
| `apps/ifci` | Futur site IFCI | Réservé |
| `apps/centre-linguistique` | Futur site du Centre linguistique | Réservé |

## Socle partagé

- `services/api` documente l'API centrale utilisée par les futurs dashboards.
- `packages/database` contient le schéma PostgreSQL multi-établissement.
- `packages/authentication` définit les règles d'identité et d'autorisation.
- `packages/contracts` contient le contrat HTTP commun.

Chaque ressource métier possède un `organization_id`. L'organisation active est dérivée d'une identité authentifiée côté serveur, jamais d'un champ libre envoyé par le navigateur. PostgreSQL applique en plus des règles RLS pour empêcher les lectures et écritures entre établissements.

## Développement local

Dans Conductor, les trois scripts `Portail du groupe`, `College CEFAT` et `Université CEFAT International` peuvent être lancés simultanément. Ils utilisent respectivement le port attribué à l'espace de travail, puis les deux ports suivants.

Sans Conductor :

```bash
python3 -m http.server 8090 --directory apps/les-universites-cefat
python3 -m http.server 8091 --directory apps/college-cefat
python3 -m http.server 8092 --directory apps/universite-cefat-international
```

Pour contrôler les fichiers locaux des trois sites :

```bash
./scripts/check-monorepo.sh
```

## Déploiements indépendants

Chaque projet d'hébergement doit utiliser son dossier d'application comme racine de publication. Un changement limité à un dossier `apps/<nom>` ne redéploie que le site concerné. Les anciens dépôts peuvent rester en lecture seule jusqu'à validation complète du monorepo, puis être archivés.

L'import du Collège a été réalisé par `git subtree`, sans `--squash`, afin de conserver ses commits d'origine. Aucun submodule n'est utilisé.
