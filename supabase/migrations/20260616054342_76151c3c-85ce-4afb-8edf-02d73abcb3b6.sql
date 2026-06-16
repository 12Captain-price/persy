CREATE TABLE public.portfolio (
  id text PRIMARY KEY DEFAULT 'main',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.portfolio TO anon, authenticated;
GRANT ALL ON public.portfolio TO service_role;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read portfolio" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Public update portfolio" ON public.portfolio FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public insert portfolio" ON public.portfolio FOR INSERT WITH CHECK (true);
INSERT INTO public.portfolio (id, data) VALUES ('main', '{}'::jsonb) ON CONFLICT (id) DO NOTHING;