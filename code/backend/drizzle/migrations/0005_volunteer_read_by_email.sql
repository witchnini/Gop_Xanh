-- Allow contributors to also read their own applications matched by email
-- (fallback for applications submitted before user_id tracking was added)
-- Uses auth.email() built-in instead of querying auth.users (no permission with publishable key)
DROP POLICY IF EXISTS "Contributors read own applications by email"
  ON public.volunteer_applications;

CREATE POLICY "Contributors read own applications by email"
  ON public.volunteer_applications
  FOR SELECT TO authenticated
  USING (email = auth.email());
