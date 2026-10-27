-- ============================================================================
--  Create or update an administrator
--  File: docs1/create-admin.sql
--
--  Usage (never put the password in shell history on a shared machine):
--      psql "$DATABASE_URL" \
--        -v admin_email="you@example.com" \
--        -v admin_password="a-long-unique-password" \
--        -v admin_name="Your Name" \
--        -v admin_role="super_admin" \
--        -f create-admin.sql
--
--  Valid roles: super_admin | editor | sales
--  Requires: pgcrypto (installed by schema.sql)
--
--  Re-running with an existing e-mail resets that user's password, name,
--  role and re-activates the account.
-- ============================================================================

\set ON_ERROR_STOP on

\if :{?admin_email}
\else
  \echo 'ERROR: missing -v admin_email=...'
  \quit
\endif

\if :{?admin_password}
\else
  \echo 'ERROR: missing -v admin_password=...'
  \quit
\endif

\if :{?admin_name}
\else
  \echo 'ERROR: missing -v admin_name=...'
  \quit
\endif

\if :{?admin_role}
\else
  \set admin_role 'editor'
\endif

SELECT (:'admin_password') ~ '.{12,}' AS password_long_enough \gset

\if :password_long_enough
\else
  \echo 'ERROR: admin_password must be at least 12 characters'
  \quit
\endif

INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES (
  :'admin_email'::citext,
  crypt(:'admin_password', gen_salt('bf', 12)),
  :'admin_name',
  :'admin_role'::admin_role,
  true
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    name          = EXCLUDED.name,
    role          = EXCLUDED.role,
    is_active     = true,
    updated_at    = now();

\echo 'Administrator saved:'
SELECT id, email, name, role, is_active, created_at
FROM admin_users
WHERE email = :'admin_email'::citext;
