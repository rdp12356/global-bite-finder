-- Allow authenticated users to insert and update restaurants for favorites upsert
CREATE POLICY "Authenticated can insert restaurants"
  ON public.restaurants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update restaurants"
  ON public.restaurants FOR UPDATE
  USING (auth.uid() IS NOT NULL);
