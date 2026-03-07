// Mock data for YuvaSeva Portal

export interface User {
  id: string;
  rollNumber: string;
  name: string;
  role: 'volunteer' | 'head';
  avatar: string;
  totalHours: number;
  eventsAttended: number;
  activitiesCompleted: number;
  branch: string;
  section: string;
  badges: string[];
  isInactive: boolean;
  inactiveWarnings: number;
  lastActivityDate: string | null;
  rewardPoints: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'blood_drive' | 'cleanup' | 'awareness' | 'donation' | 'workshop';
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface EventProposal {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  proposedDate: string;
  votes: number;
  voters: string[];
  status: 'pending' | 'approved' | 'rejected';
  location?: string;
  time?: string;
}

export interface UrgentPost {
  id: string;
  title: string;
  description: string;
  urgencyLevel: 'critical' | 'high' | 'medium';
  postedAt: string;
  category: string;
  contact: string;
  location?: string;
  bloodGroup?: string;
  helpType?: string;
  personInNeed?: string;
}

export interface ServicePost {
  id: string;
  volunteerId: string;
  volunteerName: string;
  title: string;
  description: string;
  date: string;
  photos: string[]; // URLs
  status: 'pending' | 'approved' | 'rejected';
  postedAt: string;
  pointsAwarded: number;
}

export interface RewardMilestone {
  points: number;
  name: string;
  icon: string;
  description: string;
}

export interface Certificate {
  id: string;
  eventName: string;
  date: string;
  hours: number;
  type: 'participation' | 'excellence' | 'leadership';
}

// Only 2 users
const volunteer: User = {
  id: '1',
  rollNumber: '24881A05AG',
  name: 'Volunteer AG',
  role: 'volunteer',
  avatar: 'AG',
  totalHours: 0,
  eventsAttended: 0,
  activitiesCompleted: 0,
  badges: [],
  isInactive: false,
  inactiveWarnings: 0,
  lastActivityDate: null,
  rewardPoints: 0,
};

const nssHead: User = {
  id: 'head',
  rollNumber: 'NSRINIVAS',
  name: 'N. Srinivas',
  role: 'head',
  avatar: 'NS',
  totalHours: 0,
  eventsAttended: 0,
  activitiesCompleted: 0,
  badges: [],
  isInactive: false,
  inactiveWarnings: 0,
  lastActivityDate: null,
  rewardPoints: 0,
};

export const users: User[] = [volunteer, nssHead];

const credentials: Record<string, string> = {
  '24881A05AG': 'vce@ag',
  'NSRINIVAS': 'vce@ns',
};

export const ACTIVITY_GOAL = 180;

export function authenticateUser(rollNumber: string, password: string): User | null {
  const upper = rollNumber.toUpperCase();
  const user = users.find((u) => u.rollNumber.toUpperCase() === upper);
  if (!user) return null;
  if (credentials[upper] === password) return user;
  return null;
}

// Events - empty at start
export const events: Event[] = [];

// Event Proposals - empty at start
export const eventProposals: EventProposal[] = [];

// Urgent Posts - empty until admin posts
export const urgentPosts: UrgentPost[] = [];

// Service Posts - volunteer service showcase
export const servicePosts: ServicePost[] = [];

// Certificates - empty
export const certificates: Certificate[] = [];

// Reward Milestones
export const rewardMilestones: RewardMilestone[] = [
  { points: 50, name: 'Starter', icon: '🌟', description: 'Complete 5 services' },
  { points: 100, name: 'Active Volunteer', icon: '💪', description: 'Earned 100 points' },
  { points: 250, name: 'Community Champion', icon: '🏅', description: 'Earned 250 points' },
  { points: 500, name: 'Service Legend', icon: '🏆', description: 'Earned 500 points' },
  { points: 1000, name: 'YuvaSeva Hero', icon: '👑', description: 'Earned 1000 points' },
];

// Points per action
export const POINTS = {
  EVENT_PARTICIPATION: 10,
  EVENT_ORGANIZING: 20,
  SERVICE_POST_APPROVED: 15,
  URGENT_VOLUNTEER: 25,
};

// Badge definitions
export const badgeInfo: Record<string, { name: string; icon: string; description: string }> = {
  blood_hero: { name: 'Blood Hero', icon: '🩸', description: 'Donated blood 3+ times' },
  eco_warrior: { name: 'Eco Warrior', icon: '🌱', description: 'Participated in 5+ cleanup drives' },
  first_responder: { name: 'First Responder', icon: '🚑', description: 'Emergency volunteer' },
  community_star: { name: 'Community Star', icon: '⭐', description: '50+ volunteer hours' },
  mentor: { name: 'Mentor', icon: '🎓', description: 'Guided 10+ new volunteers' },
  leader: { name: 'Leader', icon: '👑', description: 'NSS Leadership role' },
  pioneer: { name: 'Pioneer', icon: '🚀', description: 'Founded new initiative' },
};

// Leaderboard - empty since no activity
export const leaderboard: User[] = [];

// --- Roll Call Attendance Store ---
export interface AttendanceRecord {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  markedAt: string;
  presentVolunteerIds: string[];
  claimedBy: Record<string, { role: 'participant' | 'organizer'; claimedAt: string }>;
}

export const attendanceRecords: AttendanceRecord[] = [];

export const CLAIM_WINDOW_HOURS = 24 * 7; // 1 week

export function isClaimWindowOpen(record: AttendanceRecord): boolean {
  const markedTime = new Date(record.markedAt).getTime();
  const now = Date.now();
  return now - markedTime < CLAIM_WINDOW_HOURS * 60 * 60 * 1000;
}

export function getEligibleEventsForVolunteer(volunteerId: string): AttendanceRecord[] {
  return attendanceRecords.filter(
    (r) =>
      r.presentVolunteerIds.includes(volunteerId) &&
      !r.claimedBy[volunteerId] &&
      isClaimWindowOpen(r)
  );
}

export function claimEvent(
  recordIndex: number,
  volunteerId: string,
  role: 'participant' | 'organizer'
) {
  const record = attendanceRecords[recordIndex];
  if (record) {
    record.claimedBy[volunteerId] = { role, claimedAt: new Date().toISOString() };
    // Award points
    const user = users.find((u) => u.id === volunteerId);
    if (user) {
      user.rewardPoints += role === 'organizer' ? POINTS.EVENT_ORGANIZING : POINTS.EVENT_PARTICIPATION;
    }
  }
}

// --- Notification Store ---
export interface Notification {
  id: string;
  type: 'event' | 'service' | 'reward' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string; // if specific to a user, else global
}

export const notifications: Notification[] = [];

export function addNotification(n: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  notifications.unshift({
    ...n,
    id: String(Date.now() + Math.random()),
    timestamp: new Date().toISOString(),
    read: false,
  });
}
