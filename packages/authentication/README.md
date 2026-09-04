# Authentification et autorisation

## Modèle d'accès

- Une identité est globale au groupe (`users`).
- Une identité rejoint une ou plusieurs organisations par `organization_memberships`.
- Les rôles d'établissement sont `organization_admin`, `staff` et `student`.
- Le rôle `group_admin` est réservé au dashboard consolidé.
- Toute session contient l'identifiant utilisateur et l'organisation active, tous deux vérifiés côté serveur.

## Garde-fous

- Refuser par défaut une organisation absente ou inactive.
- Vérifier l'adhésion à chaque changement d'organisation active.
- Utiliser des cookies `HttpOnly`, `Secure` et `SameSite=Lax` pour une session web.
- Ne pas stocker de rôle ou de périmètre faisant autorité dans `localStorage`.
- Combiner l'autorisation applicative avec les politiques RLS de PostgreSQL.

Le format HTTP partagé est décrit dans `packages/contracts/openapi.yaml` et le modèle de données dans `packages/database/schema.sql`.
