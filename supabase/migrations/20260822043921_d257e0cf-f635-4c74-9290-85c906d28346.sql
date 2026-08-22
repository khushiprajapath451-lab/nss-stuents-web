ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS year integer;
COMMENT ON COLUMN public.profiles.year IS 'Academic year of the volunteer (e.g., 1, 2, 3, 4)';