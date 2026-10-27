-- ============================================================================
--  DESTRUCTIVE development reset
--  File: docs1/reset.sql
--
--  Deletes EVERY object in the public schema, including all data, then
--  recreates an empty schema. Run schema.sql and seed.sql afterwards.
--
--  NEVER run this against production.
--
--      psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f reset.sql
--      psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f schema.sql
--      psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f seed.sql
-- ============================================================================

\set ON_ERROR_STOP on

DO $$
BEGIN
  IF current_database() IN ('postgres', 'template0', 'template1') THEN
    RAISE EXCEPTION 'Refusing to reset protected database "%"', current_database();
  END IF;
END;
$$;

-- Drop the extensions explicitly so schema.sql can recreate their objects
-- cleanly (dropping the schema alone can leave a half-broken extension).
DROP EXTENSION IF EXISTS pg_trgm CASCADE;
DROP EXTENSION IF EXISTS citext CASCADE;
DROP EXTENSION IF EXISTS pgcrypto CASCADE;

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Restore conventional privileges. The owner of the database can recreate
-- the extensions in schema.sql.
GRANT ALL ON SCHEMA public TO CURRENT_USER;
GRANT ALL ON SCHEMA public TO public;

\echo 'Public schema reset. Now run schema.sql and seed.sql.'
