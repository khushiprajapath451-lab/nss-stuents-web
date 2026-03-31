import { useState, useEffect } from 'react';
import {
  fetchAttendanceRecords, fetchCertificates, fetchProfile,
  DbAttendanceRecord, DbCertificate, badgeInfo,
  CLAIM_WINDOW_HOURS, NSS_HOURS_GOAL,
} from '@/lib/supabaseData';
import { EligibleEventsClaim } from '@/components/EligibleEventsClaim';
import { PostService } from '@/components/PostService';
import { RewardCard } from '@/components/RewardCard';
import { ServiceTracker } from '@/components/ServiceTracker';
import { PreviousEvents } from '@/components/PreviousEvents';
import { ShareYourWork } from '@/components/ShareYourWork';
import { MyBharatTracking } from '@/components/MyBharatTracking';
import { SocialInternship } from '@/components/SocialInternship';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Award, Calendar, Clock, Download, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface MyRecordProps {
  user: {
    id: string; name: string; role: string; totalHours: number;
    eventsAttended: number; rewardPoints: number; badges: string[];
    isInactive: boolean; certificates?: any[];
  };
}

interface UserEvent {
  id: string; title: string; description: string; date: string; category: string;
}

export function MyRecord({ user }: MyRecordProps) {
  const [addedEvents, setAddedEvents] = useState<UserEvent[]>([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', category: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [, refresh] = useState(0);
  const [attendanceRecords, setAttendanceRecords] = useState<DbAttendanceRecord[]>([]);
  const [userCerts, setUserCerts] = useState<DbCertificate[]>([]);

  // Load data from DB
  useEffect(() => {
    fetchAttendanceRecords().then(setAttendanceRecords).catch(() => {});
    fetchCertificates(user.id).then(setUserCerts).catch(() => {});
    // Refresh profile stats from DB
    fetchProfile(user.id).then(profile => {
      user.totalHours = Number(profile.total_hours);
      user.eventsAttended = profile.events_attended;
      user.rewardPoints = profile.reward_points;
      refresh(n => n + 1);
    }).catch(() => {});
  }, [user.id]);

  useEffect(() => {
    const handler = () => {
      fetchProfile(user.id).then(profile => {
        user.totalHours = Number(profile.total_hours);
        user.eventsAttended = profile.events_attended;
        user.rewardPoints = profile.reward_points;
        refresh(n => n + 1);
      }).catch(() => {});
      fetchCertificates(user.id).then(setUserCerts).catch(() => {});
    };
    window.addEventListener('yuvaseva-stats-updated', handler);
    return () => window.removeEventListener('yuvaseva-stats-updated', handler);
  }, [user.id]);

  const hasAttendanceMarked = attendanceRecords.some((r) => {
    if (!r.present_volunteer_ids.includes(user.id)) return false;
    const markedTime = new Date(r.marked_at).getTime();
    return Date.now() - markedTime < CLAIM_WINDOW_HOURS * 60 * 60 * 1000;
  });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast.error('Please fill in event title and date');
      return;
    }
    const event: UserEvent = {
      id: String(Date.now()),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      category: newEvent.category || 'General',
    };
    setAddedEvents(prev => [...prev, event]);
    setNewEvent({ title: '', description: '', date: '', category: '' });
    setDialogOpen(false);
    toast.success('Event added to your record!');
  };

  const progressToNextBadge = Math.min((user.totalHours / 50) * 100, 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <ServiceTracker user={user} />
      <RewardCard user={user} />
      <PostService user={user} />
      <EligibleEventsClaim user={user} />

      {user.isInactive && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/20">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-warning">Inactivity Alert</h3>
              <p className="text-sm text-muted-foreground">
                You haven't participated in any events recently. Join an upcoming event to stay active!
              </p>
            </div>
            <Button variant="outline" className="border-warning text-warning hover:bg-warning/10">
              View Events
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Event Section */}
      <Card className={!hasAttendanceMarked ? 'opacity-60' : 'border-primary/30'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add Your Events
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {hasAttendanceMarked
                  ? 'You have been marked present! Add your event details within 1 week.'
                  : 'This section is enabled after the admin marks your attendance as present (1 week window).'}
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={!hasAttendanceMarked} className="gap-2 shadow-glow">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Event to Your Record</DialogTitle>
                  <DialogDescription>Describe the event you participated in.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input id="event-title" placeholder="e.g., Blood Donation Camp" value={newEvent.title} onChange={(e) => setNewEvent(p => ({ ...p, title: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-desc">Description</Label>
                    <Textarea id="event-desc" placeholder="Describe your participation..." value={newEvent.description} onChange={(e) => setNewEvent(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Event Date</Label>
                    <Input id="event-date" type="date" value={newEvent.date} onChange={(e) => setNewEvent(p => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-category">Category</Label>
                    <Input id="event-category" placeholder="e.g., Blood Drive, Cleanup, Workshop" value={newEvent.category} onChange={(e) => setNewEvent(p => ({ ...p, category: e.target.value }))} />
                  </div>
                  <Button onClick={handleAddEvent} className="w-full">Add to Record</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        {addedEvents.length > 0 && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {addedEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{event.category}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{event.description || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:shadow-soft transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-3xl font-bold font-display text-primary">{user.totalHours}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-soft transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Events Attended</p>
                <p className="text-3xl font-bold font-display text-primary">{user.eventsAttended + addedEvents.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-soft transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-3xl font-bold font-display text-primary">{user.badges.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-soft transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Certificates</p>
                <p className="text-3xl font-bold font-display text-primary">{userCerts.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Badge */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Progress to Community Star Badge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{user.totalHours} / 50 hours</span>
              <span className="font-medium text-primary">{Math.round(progressToNextBadge)}%</span>
            </div>
            <Progress value={progressToNextBadge} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Badges</CardTitle>
        </CardHeader>
        <CardContent>
          {user.badges.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {user.badges.map((badge) => {
                const info = badgeInfo[badge];
                return (
                  <Tooltip key={badge}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors cursor-default">
                        <span className="text-xl">{info?.icon}</span>
                        <span className="font-medium text-sm">{info?.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent><p>{info?.description}</p></TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No badges earned yet. Participate in events to earn badges!</p>
          )}
        </CardContent>
      </Card>

      <ShareYourWork user={user} />
      <MyBharatTracking user={user} />
      <SocialInternship user={user} />
      <PreviousEvents user={user} />

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userCerts.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.event_name}</TableCell>
                  <TableCell>{new Date(cert.date).toLocaleDateString()}</TableCell>
                  <TableCell>{cert.hours}h</TableCell>
                  <TableCell><Badge variant={cert.type === 'excellence' ? 'default' : 'outline'} className="capitalize">{cert.type}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Download className="h-4 w-4 mr-1" />Download</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
