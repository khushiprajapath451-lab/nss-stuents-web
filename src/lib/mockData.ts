// Mock data for NSS Portal

export interface User {
  id: string;
  rollNumber: string;
  name: string;
  role: 'volunteer' | 'head';
  avatar: string;
  totalHours: number;
  eventsAttended: number;
  badges: string[];
  isInactive: boolean;
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

// Helper to generate volunteer users
function generateVolunteers(): User[] {
  const volunteers: User[] = [];
  let id = 1;

  const addVolunteer = (rollNumber: string) => {
    const initials = rollNumber.slice(-2);
    volunteers.push({
      id: String(id++),
      rollNumber,
      name: `Volunteer ${rollNumber.slice(-3)}`,
      role: 'volunteer',
      avatar: initials,
      totalHours: 0,
      eventsAttended: 0,
      badges: [],
      isInactive: false,
    });
  };

  // Specific roll numbers
  addVolunteer('24881A05AY3');
  addVolunteer('24881A04Y8');

  // 24881A05Z1 to 24881A05Z9
  for (let i = 1; i <= 9; i++) {
    addVolunteer(`24881A05Z${i}`);
  }

  // 24881A05AA to 24881A05AZ
  for (let c = 65; c <= 90; c++) {
    addVolunteer(`24881A05A${String.fromCharCode(c)}`);
  }

  // 24881A05BA to 24881A05BY
  for (let c = 65; c <= 89; c++) {
    addVolunteer(`24881A05B${String.fromCharCode(c)}`);
  }

  return volunteers;
}

const volunteerUsers = generateVolunteers();

// NSS Head account
const nssHead: User = {
  id: 'head',
  rollNumber: 'NSS',
  name: 'NSS Head',
  role: 'head',
  avatar: 'NH',
  totalHours: 0,
  eventsAttended: 0,
  badges: [],
  isInactive: false,
};

export const users: User[] = [...volunteerUsers, nssHead];

// NSS Head password is 67899, all volunteers use 12345
export function authenticateUser(rollNumber: string, password: string): User | null {
  const user = users.find((u) => u.rollNumber.toUpperCase() === rollNumber.toUpperCase());
  if (!user) return null;
  if (user.role === 'head' && password === '67899') return user;
  if (user.role === 'volunteer' && password === '12345') return user;
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
