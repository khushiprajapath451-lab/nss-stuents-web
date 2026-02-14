// Mock data for NSS Portal

export interface User {
  id: string;
  rollNumber: string;
  name: string;
  role: 'volunteer' | 'head';
  avatar: string;
  totalHours: number;
  eventsAttended: number;
  activitiesCompleted: number;
  badges: string[];
  isInactive: boolean;
  inactiveWarnings: number; // 0, 1, or 2 — expelled after 2
  lastActivityDate: string | null;
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
}

export interface UrgentPost {
  id: string;
  title: string;
  description: string;
  urgencyLevel: 'critical' | 'high' | 'medium';
  postedAt: string;
  category: string;
  contact: string;
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

// Urgent Posts
export const urgentPosts: UrgentPost[] = [
  {
    id: '1',
    title: '🩸 Blood Donation - URGENT!',
    description: 'Patient at City Hospital requires O- blood urgently. Contact immediately if you can donate.',
    urgencyLevel: 'critical',
    postedAt: new Date().toISOString(),
    category: 'Blood Donation',
    contact: '+91 9876543210',
  },
  {
    id: '2',
    title: '🧬 Swab Donation Feb 10',
    description: 'Register for stem cell donation drive this weekend. Save lives by joining the donor registry.',
    urgencyLevel: 'high',
    postedAt: new Date(Date.now() - 3600000).toISOString(),
    category: 'Swab Donation',
    contact: 'nss@college.edu',
  },
  {
    id: '3',
    title: '📚 Book Collection Drive',
    description: 'Collecting books for underprivileged school. Donate your old textbooks and novels.',
    urgencyLevel: 'medium',
    postedAt: new Date(Date.now() - 86400000).toISOString(),
    category: 'Donation',
    contact: 'library@college.edu',
  },
];

// Certificates - empty
export const certificates: Certificate[] = [];

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
