// Mock data for Vardhaman NSS Portal

export interface User {
  id: string;
  email: string;
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

// Seeded Users
export const users: User[] = [
  {
    id: '1',
    email: 'khushi@vardhaman.edu',
    name: 'Khushi Sharma',
    role: 'volunteer',
    avatar: 'KS',
    totalHours: 45,
    eventsAttended: 12,
    badges: ['blood_hero', 'eco_warrior', 'first_responder'],
    isInactive: false,
  },
  {
    id: '2',
    email: 'rahul@vardhaman.edu',
    name: 'Rahul Verma',
    role: 'volunteer',
    avatar: 'RV',
    totalHours: 38,
    eventsAttended: 10,
    badges: ['blood_hero', 'community_star'],
    isInactive: false,
  },
  {
    id: '3',
    email: 'priya@vardhaman.edu',
    name: 'Priya Reddy',
    role: 'volunteer',
    avatar: 'PR',
    totalHours: 52,
    eventsAttended: 15,
    badges: ['blood_hero', 'eco_warrior', 'mentor'],
    isInactive: false,
  },
  {
    id: '4',
    email: 'amit@vardhaman.edu',
    name: 'Amit Kumar',
    role: 'volunteer',
    avatar: 'AK',
    totalHours: 8,
    eventsAttended: 2,
    badges: [],
    isInactive: true,
  },
  {
    id: '5',
    email: 'head@vardhaman.edu',
    name: 'Dr. Suresh Nair',
    role: 'head',
    avatar: 'SN',
    totalHours: 120,
    eventsAttended: 35,
    badges: ['leader', 'mentor', 'pioneer'],
    isInactive: false,
  },
];

// Upcoming & Past Events
export const events: Event[] = [
  {
    id: '1',
    title: 'Blood Donation Camp',
    date: '2024-02-15',
    time: '9:00 AM - 4:00 PM',
    location: 'Main Auditorium',
    description: 'Annual blood donation drive in collaboration with Red Cross',
    category: 'blood_drive',
    attendees: 45,
    maxAttendees: 100,
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Campus Cleanup Drive',
    date: '2024-02-20',
    time: '7:00 AM - 11:00 AM',
    location: 'College Campus',
    description: 'Monthly campus beautification and waste management drive',
    category: 'cleanup',
    attendees: 30,
    maxAttendees: 50,
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Health Awareness Workshop',
    date: '2024-02-10',
    time: '2:00 PM - 5:00 PM',
    location: 'Seminar Hall B',
    description: 'Workshop on mental health awareness for students',
    category: 'awareness',
    attendees: 80,
    maxAttendees: 80,
    status: 'completed',
  },
  {
    id: '4',
    title: 'Tree Plantation Drive',
    date: '2024-02-25',
    time: '8:00 AM - 12:00 PM',
    location: 'College Ground',
    description: 'Plant 500 saplings around the campus',
    category: 'cleanup',
    attendees: 25,
    maxAttendees: 75,
    status: 'upcoming',
  },
];

// Event Proposals
export const eventProposals: EventProposal[] = [
  {
    id: '1',
    title: 'Blood Drive Feb 15',
    description: 'Organize a mega blood donation camp with Red Cross partnership',
    proposedBy: 'Khushi Sharma',
    proposedDate: '2024-02-15',
    votes: 23,
    voters: ['1', '2', '3'],
    status: 'approved',
  },
  {
    id: '2',
    title: 'Village Education Camp',
    description: 'Teach basic computer skills to students in nearby villages',
    proposedBy: 'Rahul Verma',
    proposedDate: '2024-03-01',
    votes: 18,
    voters: ['1', '3'],
    status: 'pending',
  },
  {
    id: '3',
    title: 'Swachh Campus Week',
    description: 'Week-long cleanliness and hygiene awareness campaign',
    proposedBy: 'Priya Reddy',
    proposedDate: '2024-03-10',
    votes: 15,
    voters: ['2'],
    status: 'pending',
  },
  {
    id: '4',
    title: 'Senior Citizen Support',
    description: 'Visit and assist elderly at local old age home',
    proposedBy: 'Amit Kumar',
    proposedDate: '2024-03-15',
    votes: 12,
    voters: [],
    status: 'pending',
  },
];

// Urgent Posts
export const urgentPosts: UrgentPost[] = [
  {
    id: '1',
    title: '🩸 URGENT: O- Blood Needed',
    description: 'Patient at City Hospital requires O- blood urgently. Contact immediately if you can donate.',
    urgencyLevel: 'critical',
    postedAt: '2024-02-04T10:30:00',
    category: 'Blood Donation',
    contact: '+91 9876543210',
  },
  {
    id: '2',
    title: '🧬 Stem Cell Donors Needed',
    description: 'Register for stem cell donation drive this weekend. Save lives by joining the donor registry.',
    urgencyLevel: 'high',
    postedAt: '2024-02-04T08:00:00',
    category: 'Swab Donation',
    contact: 'nss@vardhaman.edu',
  },
  {
    id: '3',
    title: '📚 Book Collection Drive',
    description: 'Collecting books for underprivileged school. Donate your old textbooks and novels.',
    urgencyLevel: 'medium',
    postedAt: '2024-02-03T14:00:00',
    category: 'Donation',
    contact: 'library@vardhaman.edu',
  },
];

// Certificates for current user
export const certificates: Certificate[] = [
  {
    id: '1',
    eventName: 'Blood Donation Camp 2024',
    date: '2024-01-15',
    hours: 4,
    type: 'participation',
  },
  {
    id: '2',
    eventName: 'Campus Cleanup Drive',
    date: '2024-01-20',
    hours: 3,
    type: 'participation',
  },
  {
    id: '3',
    eventName: 'Health Awareness Workshop',
    date: '2024-02-10',
    hours: 3,
    type: 'excellence',
  },
];

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

// Leaderboard
export const leaderboard = users
  .filter(u => u.role === 'volunteer')
  .sort((a, b) => b.totalHours - a.totalHours)
  .slice(0, 5);
