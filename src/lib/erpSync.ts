import { supabase } from '@/integrations/supabase/client';
import { saveData, loadData } from '@/lib/persistence';

export interface ErpProfile {
  rollNumber: string;
  branch: string;
  section: string;
  academicYear: string;
  attendance: number | null;
  studentName: string | null;
  semester: number | null;
  syncedAt: string;
}

const ERP_KEY = 'erpProfile';

export function loadErpProfile(userId: string): ErpProfile | null {
  return loadData<ErpProfile | null>(userId, ERP_KEY, null);
}

export function saveErpProfile(userId: string, profile: ErpProfile) {
  saveData(userId, ERP_KEY, profile);
}

export async function syncWithErp(rollNumber: string, password: string): Promise<{
  success: boolean;
  data?: ErpProfile;
  error?: string;
  partial?: boolean;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('erp-sync', {
      body: { rollNumber, password },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data?.success && data?.data) {
      return {
        success: true,
        data: data.data as ErpProfile,
        partial: data.partial || false,
      };
    }

    return { success: false, error: data?.error || 'Unknown error' };
  } catch (err) {
    console.error('ERP sync failed:', err);
    return { success: false, error: 'Failed to connect to ERP. Please try again.' };
  }
}

export function isAttendanceEligible(profile: ErpProfile | null): { eligible: boolean; attendance: number | null; message: string } {
  if (!profile) {
    return { eligible: true, attendance: null, message: 'ERP not synced. Connect ERP to verify attendance.' };
  }
  if (profile.attendance === null) {
    return { eligible: true, attendance: null, message: 'Attendance data unavailable from ERP.' };
  }
  if (profile.attendance < 60) {
    return {
      eligible: false,
      attendance: profile.attendance,
      message: `Blocked: ${profile.branch} ${profile.section} sem attendance ${profile.attendance}%`,
    };
  }
  return {
    eligible: true,
    attendance: profile.attendance,
    message: `Cleared: ${profile.branch} ${profile.section} ${profile.attendance}% ✓`,
  };
}
