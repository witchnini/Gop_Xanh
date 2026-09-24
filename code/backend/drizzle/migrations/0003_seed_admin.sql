-- Seed admin account: admin@gopxanh.vn / GopXanh@2026!
-- Run this migration ONCE via Supabase SQL Editor (Dashboard → SQL Editor).
-- The password is bcrypt-hashed below; the plaintext is GopXanh@2026!

-- Step 1: Create the auth user
INSERT INTO auth.users (
  instance_id, id,
  aud, role,
  email, encrypted_password,
  email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new,
  email_change
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated', 'authenticated',
  'admin@gopxanh.vn',
  crypt('GopXanh@2026!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Quản trị viên Gop Xanh"}',
  now(), now(),
  '', '', '',
  ''
);

-- Step 2: Create identity record (required by Supabase Auth)
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
)
SELECT
  id, id, id,
  json_build_object('sub', id, 'email', email)::jsonb,
  'email', now(), now(), now()
FROM auth.users
WHERE email = 'admin@gopxanh.vn';

-- Step 3: Profile + farmer/contributor role were auto-created by trigger.
--         Now add the admin role.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@gopxanh.vn';
