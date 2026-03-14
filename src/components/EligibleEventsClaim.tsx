import { useState, useEffect } from 'react';
import {
  User,
  getEligibleEventsForVolunteer,
  claimEvent,
  attendanceRecords,
  CLAIM_WINDOW_HOURS,
} from '@/lib/mockData';
import { loadErpProfile, isAttendanceEligible } from '@/lib/erpSync';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, Clock, Info, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface EligibleEventsClaimProps {
  user: User;
}

export function EligibleEventsClaim({ user }: EligibleEventsClaimProps) {
  const [eligible, setEligible] = useState(getEligibleEventsForVolunteer(user.id));
  const [roles, setRoles] = useState<Record<number, 'participant' | 'organizer'>>({});

  // 60% attendance gate
  const erpProfile = loadErpProfile(user.id);
  const attendanceCheck = isAttendanceEligible(erpProfile);
  const blocked = !attendanceCheck.eligible;
  const [showTutorial, setShowTutorial] = useState(false);

  // Show tutorial on first eligible event
  useEffect(() => {
    if (eligible.length > 0) {
      const tutorialSeen = sessionStorage.getItem('nss_claim_tutorial_seen');
      if (!tutorialSeen) {
        setShowTutorial(true);
        sessionStorage.setItem('nss_claim_tutorial_seen', 'true');
      }
    }
  }, [eligible.length]);

  const refreshEligible = () => {
    setEligible(getEligibleEventsForVolunteer(user.id));
  };

  const handleClaim = (recordIndex: number) => {
    const role = roles[recordIndex] || 'participant';
    claimEvent(recordIndex, user.id, role);
    toast.success(`Event claimed as ${role}! Hours will be calculated automatically.`);
    refreshEligible();
  };

  const getRecordIndex = (record: typeof attendanceRecords[0]) =>
    attendanceRecords.indexOf(record);

  // Claimed events for display
  const claimed = attendanceRecords.filter((r) => r.claimedBy[user.id]);

  return (
    <>
      {/* Tutorial Popup */}
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

      {/* Eligible Events to Claim */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Eligible Events — Claim Now
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={refreshEligible}>
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
                const idx = getRecordIndex(record);
                const markedTime = new Date(record.markedAt);
                const expiresAt = new Date(markedTime.getTime() + CLAIM_WINDOW_HOURS * 60 * 60 * 1000);
                return (
                  <div
                    key={record.eventId + record.markedAt}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-background"
                  >
                    <div>
                      <p className="font-medium">{record.eventTitle}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Expires: {expiresAt.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={roles[idx] || 'participant'}
                        onValueChange={(v) =>
                          setRoles((prev) => ({ ...prev, [idx]: v as 'participant' | 'organizer' }))
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="participant">Participant</SelectItem>
                          <SelectItem value="organizer">Organizer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" onClick={() => handleClaim(idx)} className="shadow-glow">
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

      {/* Already Claimed Events */}
      {claimed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Claimed Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {claimed.map((r) => {
                const claim = r.claimedBy[user.id];
                return (
                  <div
                    key={r.eventId + r.markedAt}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium text-sm">{r.eventTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-0 capitalize">
                      {claim.role}
                    </Badge>
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
