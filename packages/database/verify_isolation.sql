INSERT INTO organizations (id, slug, name, kind) VALUES
  ('00000000-0000-0000-0000-000000000001', 'groupe-cefat', 'Groupe CEFAT', 'group'),
  ('00000000-0000-0000-0000-000000000002', 'universite-cefat-international', 'Université CEFAT International', 'university'),
  ('00000000-0000-0000-0000-000000000003', 'ifci', 'Institut de Formation CEFAT International', 'training');

INSERT INTO users (id, email, display_name) VALUES
  ('10000000-0000-0000-0000-000000000001', 'groupe@test.cefat', 'Administrateur Groupe'),
  ('10000000-0000-0000-0000-000000000002', 'uci@test.cefat', 'Administrateur UCI'),
  ('10000000-0000-0000-0000-000000000003', 'ifci@test.cefat', 'Administrateur IFCI');

INSERT INTO organization_memberships (organization_id, user_id, role) VALUES
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'group_admin'),
  ('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'organization_admin'),
  ('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'organization_admin');

INSERT INTO applications (id, organization_id, applicant_name, program_code) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Candidate UCI', 'UCI-LICENCE'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Candidate IFCI', 'IFCI-BTS');

CREATE ROLE cefat_api_test NOLOGIN NOSUPERUSER NOBYPASSRLS;
GRANT USAGE ON SCHEMA public TO cefat_api_test;
GRANT USAGE ON TYPE organization_kind, membership_role, application_status TO cefat_api_test;
GRANT SELECT ON organizations, organization_memberships TO cefat_api_test;
GRANT SELECT, INSERT, UPDATE ON applications TO cefat_api_test;
GRANT EXECUTE ON FUNCTION current_app_organization_id(), current_app_user_id(), current_app_is_group_admin() TO cefat_api_test;

SET ROLE cefat_api_test;

BEGIN;
SELECT set_config('app.user_id', '10000000-0000-0000-0000-000000000002', true);
SELECT set_config('app.organization_id', '00000000-0000-0000-0000-000000000002', true);

DO $$
BEGIN
  IF (SELECT count(*) FROM applications) <> 1 THEN
    RAISE EXCEPTION 'Un compte UCI doit voir exactement les données UCI';
  END IF;

  BEGIN
    INSERT INTO applications (organization_id, applicant_name, program_code)
    VALUES ('00000000-0000-0000-0000-000000000003', 'Intrusion', 'IFCI-INTERDIT');
    RAISE EXCEPTION 'Une écriture inter-organisation a été autorisée';
  EXCEPTION
    WHEN insufficient_privilege THEN NULL;
  END;
END
$$;
ROLLBACK;

BEGIN;
SELECT set_config('app.user_id', '10000000-0000-0000-0000-000000000001', true);
SELECT set_config('app.organization_id', '00000000-0000-0000-0000-000000000001', true);

DO $$
BEGIN
  IF (SELECT count(*) FROM applications) <> 2 THEN
    RAISE EXCEPTION 'Le compte groupe doit disposer de la vue consolidée';
  END IF;
END
$$;
ROLLBACK;

RESET ROLE;
