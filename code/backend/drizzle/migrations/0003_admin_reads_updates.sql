CREATE POLICY "Admins read all campaign updates"
ON public.campaign_updates
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));