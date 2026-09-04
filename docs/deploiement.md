# Déploiements par application

Les trois sites actifs sont statiques et n'ont pas d'étape de compilation. Chaque projet de déploiement doit définir une racine et un filtre de chemins distincts.

| Projet | Racine publiée | Filtre de déploiement |
| --- | --- | --- |
| Les Universités CEFAT | `apps/les-universites-cefat` | `apps/les-universites-cefat/**` |
| College CEFAT | `apps/college-cefat` | `apps/college-cefat/**` |
| Université CEFAT International | `apps/universite-cefat-international` | `apps/universite-cefat-international/**` |

Les modifications de `packages/contracts/**`, `packages/authentication/**` ou `packages/database/**` doivent déclencher les tests des futurs dashboards et de `services/api`, mais pas la publication des sites statiques.

Le domaine public reste configuré dans le projet d'hébergement de chaque établissement. Aucun site ne dépend d'un chemin monorepo en production : tous les liens vers un autre établissement utilisent son domaine canonique.
