import { useState, useEffect } from 'react';
import { User, certificates, events, badgeInfo, attendanceRecords, CLAIM_WINDOW_HOURS } from '@/lib/mockData';
import { EligibleEventsClaim } from '@/components/EligibleEventsClaim';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Award, Calendar, Clock, Download, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface MyRecordProps {
  user: User;
}

interface UserEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

export function MyRecord({ user }: MyRecordProps) {
  const [addedEvents, setAddedEvents] = useState<UserEvent[]>([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', category: '' });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Check if volunteer has any attendance records marked as present
  // Check if volunteer has been marked present within the claim window (1 week)
  const hasAttendanceMarked = attendanceRecords.some((r) => {
    if (!r.presentVolunteerIds.includes(user.id)) return false;
    const markedTime = new Date(r.markedAt).getTime();
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
    setAddedEvents((prev) => [...prev, event]);
    setNewEvent({ title: '', description: '', date: '', category: '' });
    setDialogOpen(false);
    toast.success('Event added to your record!');
  };

  // Only show events the user actually attended (none for new volunteers)
  const userEvents = user.eventsAttended > 0
    ? events.filter((e) => e.status === 'completed').slice(0, user.eventsAttended)
    : [];
  const progressToNextBadge = Math.min((user.totalHours / 50) * 100, 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Eligible Events Claim Section */}
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
                  <DialogDescription>
                    Describe the event you participated in.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input
                      id="event-title"
                      placeholder="e.g., Blood Donation Camp"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-desc">Description</Label>
                    <Textarea
                      id="event-desc"
                      placeholder="Describe your participation and contributions..."
                      value={newEvent.description}
                      onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Event Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent((p) => ({ ...p, date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-category">Category</Label>
                    <Input
                      id="event-category"
                      placeholder="e.g., Blood Drive, Cleanup, Workshop"
                      value={newEvent.category}
                      onChange={(e) => setNewEvent((p) => ({ ...p, category: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleAddEvent} className="w-full">
                    Add to Record
                  </Button>
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
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{event.category}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                      {event.description || '—'}
                    </TableCell>
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
                <p className="text-3xl font-bold font-display text-primary">{certificates.length}</p>
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
                    <TooltipContent>
                      <p>{info?.description}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No badges earned yet. Participate in events to earn badges!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Events History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Events</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {event.category.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      Attended
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
              {certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.eventName}</TableCell>
                  <TableCell>{new Date(cert.date).toLocaleDateString()}</TableCell>
                  <TableCell>{cert.hours}h</TableCell>
                  <TableCell>
                    <Badge
                      variant={cert.type === 'excellence' ? 'default' : 'outline'}
                      className="capitalize"
                    >
                      {cert.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
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
