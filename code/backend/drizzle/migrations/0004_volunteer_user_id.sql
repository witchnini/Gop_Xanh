-- Add user_id to volunteer_applications so contributors can see their own history
ALTER TABLE public.volunteer_applications
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Allow contributors to read their own applications
CREATE POLICY "Contributors read own applications"
  ON public.volunteer_applications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
