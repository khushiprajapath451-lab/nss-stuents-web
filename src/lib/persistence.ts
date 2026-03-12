// localStorage persistence helpers keyed by user ID

export function saveData<T>(userId: string, key: string, data: T) {
  try {
    localStorage.setItem(`yuvaseva_${userId}_${key}`, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

export function loadData<T>(userId: string, key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`yuvaseva_${userId}_${key}`);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // Corrupted data
  }
  return fallback;
}

// Keys
export const KEYS = {
  PREVIOUS_EVENTS: 'previousEvents',
  ADDED_EVENTS: 'addedEvents',
  MYBHARAT: 'mybharat',
  INTERNSHIPS: 'internships',
  USER_STATS: 'userStats',
} as const;

export interface PersistedUserStats {
  totalHours: number;
  eventsAttended: number;
  rewardPoints: number;
  certificates: { id: string; eventName: string; date: string; hours: number; type: 'participation' | 'excellence' | 'leadership' }[];
}

export function loadUserStats(userId: string): PersistedUserStats | null {
  return loadData<PersistedUserStats | null>(userId, KEYS.USER_STATS, null);
}

export function saveUserStats(userId: string, stats: PersistedUserStats) {
  saveData(userId, KEYS.USER_STATS, stats);
}
