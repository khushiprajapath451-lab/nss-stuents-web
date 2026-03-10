import { users, User, addNotification, POINTS } from './mockData';

export interface InviteRecord {
  inviteCode: string;
  inviterId: string;
  invitedUserId: string | null;
  createdAt: string;
  joinedAt: string | null;
}

export const inviteRecords: InviteRecord[] = [];

export function generateInviteCode(userId: string): string {
  const existing = inviteRecords.find(
    (r) => r.inviterId === userId && !r.invitedUserId
  );
  if (existing) return existing.inviteCode;

  const code = `${userId.slice(0, 4)}-${Date.now().toString(36)}`;
  inviteRecords.push({
    inviteCode: code,
    inviterId: userId,
    invitedUserId: null,
    createdAt: new Date().toISOString(),
    joinedAt: null,
  });
  return code;
}

export function getUserInviteCode(userId: string): string {
  // Deterministic invite code per user
  const base = btoa(userId).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
  return `${base}`;
}

export function getInviterByCode(code: string): User | null {
  // The invite code is derived from userId, reverse lookup
  for (const u of users) {
    if (getUserInviteCode(u.id) === code) return u;
  }
  // Also check invite records
  const record = inviteRecords.find((r) => r.inviteCode === code);
  if (record) return users.find((u) => u.id === record.inviterId) || null;
  return null;
}

export function recordInviteJoin(inviterCode: string, newUserId: string) {
  const inviter = getInviterByCode(inviterCode);
  if (!inviter) return;

  inviteRecords.push({
    inviteCode: inviterCode,
    inviterId: inviter.id,
    invitedUserId: newUserId,
    createdAt: new Date().toISOString(),
    joinedAt: new Date().toISOString(),
  });

  // Award points to inviter
  inviter.rewardPoints += 5;
  addNotification({
    type: 'reward',
    title: 'Invite Reward!',
    message: 'You earned 5 points for inviting a volunteer!',
    userId: inviter.id,
  });
}

export function getInvitesByUser(userId: string): InviteRecord[] {
  return inviteRecords.filter((r) => r.inviterId === userId && r.invitedUserId);
}

export function getTotalInviteStats() {
  const joined = inviteRecords.filter((r) => r.invitedUserId);
  const inviterCounts: Record<string, number> = {};
  joined.forEach((r) => {
    inviterCounts[r.inviterId] = (inviterCounts[r.inviterId] || 0) + 1;
  });

  const topInviters = Object.entries(inviterCounts)
    .map(([userId, count]) => ({
      user: users.find((u) => u.id === userId),
      count,
    }))
    .filter((e) => e.user)
    .sort((a, b) => b.count - a.count);

  return {
    totalInvited: joined.length,
    activeFromInvites: joined.filter((r) => {
      const u = users.find((u) => u.id === r.invitedUserId);
      return u && !u.isInactive;
    }).length,
    topInviters,
  };
}
