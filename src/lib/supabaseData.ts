// Supabase data service layer - replaces mock arrays with real DB queries
import { supabase } from '@/integrations/supabase/client';

// ---- Types matching DB schema ----
export interface DbProfile {
  id: string;
  roll_number: string;
  name: string;
  role: string;
  avatar: string;
  branch: string;
  section: string;
  semester: number;
  total_hours: number;
  events_attended: number;
  activities_completed: number;
  reward_points: number;
  badges: string[];
  is_inactive: boolean;
  inactive_warnings: number;
  last_activity_date: string | null;
}

export interface DbEventProposal {
  id: string;
  title: string;
  description: string;
  proposed_by: string;
  proposed_date: string | null;
  votes: number;
  voters: string[];
  status: string;
  location: string | null;
  time: string | null;
  created_at: string;
}

export interface DbUrgentAlert {
  id: string;
  title: string;
  description: string;
  urgency_level: string;
  posted_at: string;
  category: string;
  contact: string;
  location: string | null;
  blood_group: string | null;
  help_type: string | null;
  person_in_need: string | null;
}

export interface DbServicePost {
  id: string;
  volunteer_id: string;
  volunteer_name: string;
  title: string;
  description: string;
  date: string;
  photos: string[];
  status: string;
  posted_at: string;
  points_awarded: number;
  hours_requested: number;
}

export interface DbAttendanceRecord {
  id: string;
  event_id: string;
  event_title: string;
  event_date: string;
  marked_at: string;
  present_volunteer_ids: string[];
  claimed_by: Record<string, { role: string; claimedAt: string }>;
}

export interface DbNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  user_id: string | null;
}

export interface DbPreviousEvent {
  id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  hours: number;
  certificate_file: string | null;
}

export interface DbCertificate {
  id: string;
  user_id: string;
  event_name: string;
  date: string;
  hours: number;
  type: string;
}

// ---- Profiles ----
export async function fetchProfiles() {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return (data || []) as DbProfile[];
}

export async function fetchProfile(id: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data as DbProfile;
}

export async function updateProfile(id: string, updates: Partial<DbProfile>) {
  const { error } = await supabase.from('profiles').update(updates).eq('id', id);
  if (error) throw error;
}

export async function authenticateUser(rollNumber: string, password: string) {
  const credentials: Record<string, string> = {
    '24881A05AG': 'vce@ag',
    'NSRINIVAS': 'vce@ns',
  };
  const upper = rollNumber.toUpperCase();
  if (credentials[upper] !== password) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('roll_number', upper).single();
  if (error || !data) return null;
  return data as DbProfile;
}

// ---- Event Proposals ----
export async function fetchEventProposals() {
  const { data, error } = await supabase.from('event_proposals').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as DbEventProposal[];
}

export async function createEventProposal(proposal: Omit<DbEventProposal, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('event_proposals').insert(proposal).select().single();
  if (error) throw error;
  return data as DbEventProposal;
}

export async function updateEventProposal(id: string, updates: Partial<DbEventProposal>) {
  const { error } = await supabase.from('event_proposals').update(updates).eq('id', id);
  if (error) throw error;
}

// ---- Urgent Alerts ----
export async function fetchUrgentAlerts() {
  const { data, error } = await supabase.from('urgent_alerts').select('*').order('posted_at', { ascending: false });
  if (error) throw error;
  return (data || []) as DbUrgentAlert[];
}

export async function createUrgentAlert(alert: Omit<DbUrgentAlert, 'id' | 'posted_at'>) {
  const { data, error } = await supabase.from('urgent_alerts').insert(alert).select().single();
  if (error) throw error;
  return data as DbUrgentAlert;
}

// ---- Service Posts ----
export async function fetchServicePosts() {
  const { data, error } = await supabase.from('service_posts').select('*').order('posted_at', { ascending: false });
  if (error) throw error;
  return (data || []) as DbServicePost[];
}

export async function createServicePost(post: Omit<DbServicePost, 'id' | 'posted_at' | 'hours_requested'> & { hours_requested?: number }) {
  const { data, error } = await supabase.from('service_posts').insert(post).select().single();
  if (error) throw error;
  return data as DbServicePost;
}

export async function updateServicePost(id: string, updates: Partial<DbServicePost>) {
  const { error } = await supabase.from('service_posts').update(updates).eq('id', id);
  if (error) throw error;
}

// ---- Attendance Records ----
export async function fetchAttendanceRecords() {
  const { data, error } = await supabase.from('attendance_records').select('*').order('marked_at', { ascending: false });
  if (error) throw error;
  return (data || []) as DbAttendanceRecord[];
}

export async function createAttendanceRecord(record: Omit<DbAttendanceRecord, 'id' | 'marked_at'>) {
  const { data, error } = await supabase.from('attendance_records').insert(record).select().single();
  if (error) throw error;
  return data as DbAttendanceRecord;
}

export async function updateAttendanceRecord(id: string, updates: Partial<DbAttendanceRecord>) {
  const { error } = await supabase.from('attendance_records').update(updates).eq('id', id);
  if (error) throw error;
}

// ---- Notifications ----
export async function fetchNotifications() {
  const { data, error } = await supabase.from('notifications').select('*').order('timestamp', { ascending: false }).limit(50);
  if (error) throw error;
  return (data || []) as DbNotification[];
}

export async function createNotification(n: Omit<DbNotification, 'id' | 'timestamp' | 'read'>) {
  const { error } = await supabase.from('notifications').insert({ ...n, read: false }).select();
  if (error) throw error;
}

export async function markNotificationsRead() {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('read', false);
  if (error) throw error;
}

// ---- Previous Events ----
export async function fetchPreviousEvents(userId: string) {
  const { data, error } = await supabase.from('previous_events').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as DbPreviousEvent[];
}

export async function createPreviousEvent(event: Omit<DbPreviousEvent, 'id'>) {
  const { data, error } = await supabase.from('previous_events').insert(event).select().single();
  if (error) throw error;
  return data as DbPreviousEvent;
}

// ---- Certificates ----
export async function fetchCertificates(userId: string) {
  const { data, error } = await supabase.from('certificates').select('*').eq('user_id', userId);
  if (error) throw error;
  return (data || []) as DbCertificate[];
}

export async function createCertificate(cert: Omit<DbCertificate, 'id'>) {
  const { data, error } = await supabase.from('certificates').insert(cert).select().single();
  if (error) throw error;
  return data as DbCertificate;
}

// ---- Helpers ----
export const CLAIM_WINDOW_HOURS = 24 * 7;
export const ACTIVITY_GOAL = 180;
export const NSS_HOURS_GOAL = 240;
export const POINTS = {
  EVENT_PARTICIPATION: 10,
  EVENT_ORGANIZING: 20,
  SERVICE_POST_APPROVED: 15,
  URGENT_VOLUNTEER: 25,
};

export const rewardMilestones = [
  { points: 50, name: 'Starter', icon: '🌟', description: 'Complete 5 services' },
  { points: 100, name: 'Active Volunteer', icon: '💪', description: 'Earned 100 points' },
  { points: 250, name: 'Community Champion', icon: '🏅', description: 'Earned 250 points' },
  { points: 500, name: 'Service Legend', icon: '🏆', description: 'Earned 500 points' },
  { points: 1000, name: 'YuvaSeva Hero', icon: '👑', description: 'Earned 1000 points' },
];

export const badgeInfo: Record<string, { name: string; icon: string; description: string }> = {
  blood_hero: { name: 'Blood Hero', icon: '🩸', description: 'Donated blood 3+ times' },
  eco_warrior: { name: 'Eco Warrior', icon: '🌱', description: 'Participated in 5+ cleanup drives' },
  first_responder: { name: 'First Responder', icon: '🚑', description: 'Emergency volunteer' },
  community_star: { name: 'Community Star', icon: '⭐', description: '50+ volunteer hours' },
  mentor: { name: 'Mentor', icon: '🎓', description: 'Guided 10+ new volunteers' },
  leader: { name: 'Leader', icon: '👑', description: 'NSS Leadership role' },
  pioneer: { name: 'Pioneer', icon: '🚀', description: 'Founded new initiative' },
};

// Convert DB profile to legacy User shape for existing components
export function dbProfileToUser(p: DbProfile) {
  return {
    id: p.id,
    rollNumber: p.roll_number,
    name: p.name,
    role: p.role as 'volunteer' | 'head',
    avatar: p.avatar,
    branch: p.branch,
    section: p.section,
    semester: p.semester,
    totalHours: Number(p.total_hours),
    eventsAttended: p.events_attended,
    activitiesCompleted: p.activities_completed,
    badges: p.badges || [],
    isInactive: p.is_inactive,
    inactiveWarnings: p.inactive_warnings,
    lastActivityDate: p.last_activity_date,
    rewardPoints: p.reward_points,
    certificates: [] as { id: string; eventName: string; date: string; hours: number; type: 'participation' | 'excellence' | 'leadership' }[],
  };
}
