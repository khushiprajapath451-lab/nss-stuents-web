
-- Enable RLS on all tables with permissive policies for demo
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.urgent_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.previous_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Permissive policies for demo (no real auth)
CREATE POLICY "Allow all on profiles" ON public.profiles FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on event_proposals" ON public.event_proposals FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on urgent_alerts" ON public.urgent_alerts FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on service_posts" ON public.service_posts FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on attendance_records" ON public.attendance_records FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on notifications" ON public.notifications FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on previous_events" ON public.previous_events FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on certificates" ON public.certificates FOR ALL TO anon USING (true) WITH CHECK (true);
