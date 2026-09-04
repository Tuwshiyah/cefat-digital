# API centrale CEFAT

Ce dossier accueillera le service HTTP commun aux dashboards. Le contrat initial est dans [`packages/contracts/openapi.yaml`](../../packages/contracts/openapi.yaml).

## Règles obligatoires

1. Authentifier chaque requête avant tout accès métier.
2. Déduire `organization_id` de la session validée et des adhésions enregistrées.
3. Ouvrir une transaction puis définir `SET LOCAL app.organization_id`.
4. Ne jamais accepter un `organization_id` fourni par le client pour élargir sa portée.
5. Autoriser une vue consolidée uniquement aux comptes possédant le rôle `group_admin`.
6. Journaliser les changements sensibles avec l'utilisateur et l'organisation concernés.

Le schéma fourni est un socle de sécurité. Le choix du framework, du fournisseur d'identité et de l'hébergeur doit être validé avant d'implémenter l'API de production.
