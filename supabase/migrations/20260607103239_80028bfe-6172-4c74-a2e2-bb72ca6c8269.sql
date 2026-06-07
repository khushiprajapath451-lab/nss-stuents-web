DELETE FROM public.event_proposals;
DELETE FROM public.previous_events WHERE user_id = '1';
DELETE FROM public.certificates WHERE user_id = '1';
UPDATE public.profiles SET total_hours = 0, events_attended = 0, reward_points = 0 WHERE id = '1';