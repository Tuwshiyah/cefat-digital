# Base de données partagée

`schema.sql` fournit le point de départ PostgreSQL du modèle multi-établissement. Les tables métier portent toutes un `organization_id` et utilisent la Row-Level Security (RLS).

Avant une requête métier, l'API doit ouvrir une transaction et définir le contexte validé :

```sql
BEGIN;
SET LOCAL app.user_id = '00000000-0000-0000-0000-000000000000';
SET LOCAL app.organization_id = '00000000-0000-0000-0000-000000000000';
-- requêtes limitées par les politiques RLS
COMMIT;
```

Le rôle de connexion utilisé par l'API ne doit être ni propriétaire des tables, ni superutilisateur, et ne doit pas disposer de `BYPASSRLS`.

`verify_isolation.sql` est exécuté par la CI sur PostgreSQL. Il vérifie qu'un administrateur UCI ne voit que les candidatures UCI, qu'une écriture destinée à IFCI est refusée et que l'administrateur groupe peut lire la vue consolidée.
