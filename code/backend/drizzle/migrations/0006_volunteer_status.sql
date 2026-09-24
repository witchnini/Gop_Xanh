-- Add status column to volunteer_applications for admin review workflow
ALTER TABLE public.volunteer_applications
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'cho_duyet'
  CHECK (status IN ('cho_duyet', 'da_duyet', 'tu_choi'));

-- Allow admins to update status
CREATE POLICY "Admins update volunteer status"
  ON public.volunteer_applications
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
