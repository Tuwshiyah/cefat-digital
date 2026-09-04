CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE organization_kind AS ENUM ('group', 'university', 'school', 'training', 'languages');
CREATE TYPE membership_role AS ENUM ('group_admin', 'organization_admin', 'staff', 'student');
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'reviewing', 'accepted', 'rejected');

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text NOT NULL,
  kind organization_kind NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (email = lower(email)),
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE organization_memberships (
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role membership_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, user_id)
);

CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  applicant_name text NOT NULL,
  applicant_email text,
  program_code text NOT NULL,
  status application_status NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX applications_organization_created_idx
  ON applications (organization_id, created_at DESC);

ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships FORCE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications FORCE ROW LEVEL SECURITY;

CREATE FUNCTION current_app_organization_id() RETURNS uuid
LANGUAGE sql STABLE
RETURN nullif(current_setting('app.organization_id', true), '')::uuid;

CREATE FUNCTION current_app_user_id() RETURNS uuid
LANGUAGE sql STABLE
RETURN nullif(current_setting('app.user_id', true), '')::uuid;

CREATE FUNCTION current_app_is_group_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
RETURN EXISTS (
  SELECT 1
  FROM organization_memberships AS membership
  JOIN organizations AS organization ON organization.id = membership.organization_id
  WHERE membership.user_id = current_app_user_id()
    AND membership.role = 'group_admin'
    AND organization.kind = 'group'
    AND organization.is_active
);

CREATE POLICY memberships_same_organization ON organization_memberships
  USING (
    (
      organization_id = current_app_organization_id()
      AND user_id = current_app_user_id()
    )
    OR current_app_is_group_admin()
  );

CREATE POLICY applications_same_organization ON applications
  USING (
    organization_id = current_app_organization_id()
    OR current_app_is_group_admin()
  )
  WITH CHECK (organization_id = current_app_organization_id());

COMMENT ON FUNCTION current_app_organization_id IS
  'Organisation active issue d une session authentifiee et definie par l API dans la transaction.';

COMMENT ON FUNCTION current_app_is_group_admin IS
  'Autorise la lecture consolidee du groupe sans permettre l ecriture dans une autre organisation.';
