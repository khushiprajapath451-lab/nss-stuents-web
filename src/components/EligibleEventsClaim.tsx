import { useState, useEffect } from 'react';
import {
  fetchAttendanceRecords, updateAttendanceRecord,
  DbAttendanceRecord, CLAIM_WINDOW_HOURS, POINTS,
} from '@/lib/supabaseData';
import { loadErpProfile, isAttendanceEligible } from '@/lib/erpSync';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, Clock, Info, Sparkles, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { updateProfile, fetchProfile } from '@/lib/supabaseData';

interface EligibleEventsClaimProps {
  user: { id: string; rewardPoints: number };
}

export function EligibleEventsClaim({ user }: EligibleEventsClaimProps) {
  const [allRecords, setAllRecords] = useState<DbAttendanceRecord[]>([]);
  const [roles, setRoles] = useState<Record<string, 'participant' | 'organizer'>>({});
  const [showTutorial, setShowTutorial] = useState(false);

  const erpProfile = loadErpProfile(user.id);
  const attendanceCheck = isAttendanceEligible(erpProfile);
  const blocked = !attendanceCheck.eligible;

  useEffect(() => {
    fetchAttendanceRecords().then(setAllRecords).catch(() => {});
  }, []);

  const eligible = allRecords.filter(r => {
    if (!r.present_volunteer_ids.includes(user.id)) return false;
    const cb = r.claimed_by as Record<string, any>;
    if (cb[user.id]) return false;
    const markedTime = new Date(r.marked_at).getTime();
    return Date.now() - markedTime < CLAIM_WINDOW_HOURS * 60 * 60 * 1000;
  });

  const claimed = allRecords.filter(r => {
    const cb = r.claimed_by as Record<string, any>;
    return cb[user.id];
  });

  useEffect(() => {
    if (eligible.length > 0) {
      const tutorialSeen = sessionStorage.getItem('nss_claim_tutorial_seen');
      if (!tutorialSeen) {
        setShowTutorial(true);
        sessionStorage.setItem('nss_claim_tutorial_seen', 'true');
      }
    }
  }, [eligible.length]);

  const handleClaim = async (record: DbAttendanceRecord) => {
    const role = roles[record.id] || 'participant';
    const newClaimedBy = {
      ...(record.claimed_by as Record<string, any>),
      [user.id]: { role, claimedAt: new Date().toISOString() },
    };
    await updateAttendanceRecord(record.id, { claimed_by: newClaimedBy as any });

    // Award points
    const pts = role === 'organizer' ? POINTS.EVENT_ORGANIZING : POINTS.EVENT_PARTICIPATION;
    const profile = await fetchProfile(user.id);
    await updateProfile(user.id, { reward_points: profile.reward_points + pts });
    user.rewardPoints += pts;

    toast.success(`Event claimed as ${role}! Hours will be calculated automatically.`);
    fetchAttendanceRecords().then(setAllRecords).catch(() => {});
  };

  return (
    <>
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Faculty Marked You Present!
            </DialogTitle>
            <DialogDescription>
              Great news! The NSS Head has marked your attendance for an event.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium">How it works:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1 text-muted-foreground">
                  <li>Faculty marks your attendance during events</li>
                  <li>You'll see eligible events here within {CLAIM_WINDOW_HOURS} hours</li>
                  <li>Choose your role (Participant or Organizer)</li>
                  <li>Tap "Claim" to add it to your record — hours auto-calculate!</li>
                </ol>
              </div>
            </div>
            <Button onClick={() => setShowTutorial(false)} className="w-full">
              Got it, let me claim!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {blocked && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 py-4">
            <XCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="font-medium text-destructive text-sm">Event Claiming Blocked</p>
              <p className="text-xs text-muted-foreground">{attendanceCheck.message}</p>
              <p className="text-xs text-muted-foreground mt-1">Maintain 60%+ semester attendance to claim events.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className={`border-primary/30 bg-primary/5 ${blocked ? 'opacity-50 pointer-events-none' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Eligible Events — Claim Now
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => fetchAttendanceRecords().then(setAllRecords)}>
              Refresh
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Faculty marked you present. Claim within {CLAIM_WINDOW_HOURS}hrs to add to your record.
          </p>
        </CardHeader>
        <CardContent>
          {eligible.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              No eligible events to claim right now. Check back after the NSS Head marks attendance.
            </p>
          ) : (
            <div className="space-y-3">
              {eligible.map((record) => {
                const expiresAt = new Date(new Date(record.marked_at).getTime() + CLAIM_WINDOW_HOURS * 60 * 60 * 1000);
                return (
                  <div key={record.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-background">
                    <div>
                      <p className="font-medium">{record.event_title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Expires: {expiresAt.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={roles[record.id] || 'participant'}
                        onValueChange={(v) => setRoles(prev => ({ ...prev, [record.id]: v as 'participant' | 'organizer' }))}
                      >
                        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="participant">Participant</SelectItem>
                          <SelectItem value="organizer">Organizer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" onClick={() => handleClaim(record)} className="shadow-glow">
                        Claim
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {claimed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Claimed Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {claimed.map((r) => {
                const cb = r.claimed_by as Record<string, any>;
                const claim = cb[user.id];
                return (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{r.event_title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(r.event_date).toLocaleDateString()}</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-0 capitalize">{claim?.role}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
