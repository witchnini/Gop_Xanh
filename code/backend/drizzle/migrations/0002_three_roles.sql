ALTER TYPE public.app_role RENAME VALUE 'farmer' TO 'partner';
ALTER TYPE public.app_role ADD VALUE 'contributor';

ALTER TABLE public.profiles ADD COLUMN entity_type text
  CHECK (entity_type IN ('farmer', 'cooperative', 'enterprise'));

-- Existing profiles need their entity type confirmed, rather than inferred.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  selected_role text := 'contributor';
  selected_entity text;
BEGIN
  IF NEW.raw_user_meta_data->>'account_role' = 'partner' THEN
    selected_role := 'partner';
    selected_entity := NEW.raw_user_meta_data->>'entity_type';
    IF selected_entity IS NULL OR selected_entity NOT IN ('farmer', 'cooperative', 'enterprise') THEN
      RAISE EXCEPTION 'A valid entity type is required for partners';
    END IF;
  END IF;
  INSERT INTO public.profiles (id, full_name, organization, phone, entity_type)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'organization', NEW.raw_user_meta_data->>'phone', selected_entity);
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, selected_role::public.app_role);
  RETURN NEW;
END;
$$;

DROP POLICY "Owners insert own campaigns" ON public.campaigns;
CREATE POLICY "Partners insert own campaigns" ON public.campaigns
FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = owner_id AND public.has_role(auth.uid(), 'partner')
  AND status = 'cho_duyet' AND raised = 0 AND supporters = 0 AND review_note IS NULL
);

DROP POLICY "Owners update own pending campaigns" ON public.campaigns;
CREATE POLICY "Partners update own pending campaigns" ON public.campaigns
FOR UPDATE TO authenticated
USING (auth.uid() = owner_id AND public.has_role(auth.uid(), 'partner') AND status IN ('cho_duyet', 'can_bo_sung'))
WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'partner') AND status IN ('cho_duyet', 'can_bo_sung'));

DROP POLICY "Owners post updates" ON public.campaign_updates;
CREATE POLICY "Partners post own updates" ON public.campaign_updates
FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'partner') AND EXISTS (
    SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.owner_id = auth.uid()
  )
);
