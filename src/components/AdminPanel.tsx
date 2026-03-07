import { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  users, User, ACTIVITY_GOAL, attendanceRecords, eventProposals,
  urgentPosts, servicePosts, POINTS, addNotification,
} from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertTriangle, CheckCircle, Shield, Trophy, Users as UsersIcon, XCircle,
  Plus, Megaphone, Heart, Check, X, Gift, Download,
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminPanel() {
  const volunteers = users.filter((u) => u.role === 'volunteer');
  const approvedEvents = eventProposals.filter((p) => p.status === 'approved');

  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [warnings, setWarnings] = useState<Record<string, number>>({});
  const [expelled, setExpelled] = useState<Record<string, boolean>>({});

  // Alert posting
  const [alertDialog, setAlertDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '', description: '', urgencyLevel: 'high' as 'critical' | 'high' | 'medium',
    category: '', contact: '', location: '', bloodGroup: '', helpType: '', personInNeed: '',
  });

  // Service posts management
  const [, forceUpdate] = useState(0);
  const pendingServices = servicePosts.filter((s) => s.status === 'pending');

  // Reward management
  const [rewardUserId, setRewardUserId] = useState('');
  const [rewardPoints, setRewardPoints] = useState('');

  const toggleAttendance = (userId: string) => {
    setAttendance((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const issueWarning = (userId: string, userName: string) => {
    setWarnings((prev) => {
      const current = prev[userId] || 0;
      const next = current + 1;
      if (next >= 2) {
        setExpelled((ep) => ({ ...ep, [userId]: true }));
        toast.error(`${userName} has been expelled from NSS after 2 warnings.`);
      } else {
        toast.warning(`Warning ${next}/2 issued to ${userName}.`);
      }
      return { ...prev, [userId]: next };
    });
  };

  const handleSaveAttendance = () => {
    if (!selectedEvent) { toast.error('Please select an event first.'); return; }
    const event = approvedEvents.find((e) => e.id === selectedEvent);
    if (event) {
      const presentIds = Object.entries(attendance).filter(([, p]) => p).map(([id]) => id);
      attendanceRecords.push({
        eventId: event.id, eventTitle: event.title, eventDate: event.proposedDate,
        markedAt: new Date().toISOString(), presentVolunteerIds: presentIds, claimedBy: {},
      });
      addNotification({ type: 'event', title: 'Attendance Marked', message: `Roll call saved for "${event.title}". ${presentIds.length} volunteer(s) present.` });
    }
    toast.success(`Roll call saved: ${Object.values(attendance).filter(Boolean).length} volunteer(s) marked present.`);
    setAttendance({});
    setSelectedEvent('');
  };

  const handlePostAlert = () => {
    if (!newAlert.title || !newAlert.description || !newAlert.contact) {
      toast.error('Title, description, and contact are required.');
      return;
    }
    urgentPosts.unshift({
      id: String(Date.now()),
      ...newAlert,
      postedAt: new Date().toISOString(),
    });
    addNotification({ type: 'alert', title: '🚨 New Urgent Alert', message: newAlert.title });
    setNewAlert({ title: '', description: '', urgencyLevel: 'high', category: '', contact: '', location: '', bloodGroup: '', helpType: '', personInNeed: '' });
    setAlertDialog(false);
    toast.success('Alert posted! It will appear on the Home Page immediately.');
    forceUpdate((n) => n + 1);
  };

  const handleApproveService = (postId: string) => {
    const post = servicePosts.find((s) => s.id === postId);
    if (post) {
      post.status = 'approved';
      post.pointsAwarded = POINTS.SERVICE_POST_APPROVED;
      const user = users.find((u) => u.id === post.volunteerId);
      if (user) user.rewardPoints += POINTS.SERVICE_POST_APPROVED;
      addNotification({ type: 'service', title: 'Service Approved', message: `"${post.title}" by ${post.volunteerName} has been approved!`, userId: post.volunteerId });
      toast.success(`Service post approved! ${post.volunteerName} earned ${POINTS.SERVICE_POST_APPROVED} points.`);
      forceUpdate((n) => n + 1);
    }
  };

  const handleRejectService = (postId: string) => {
    const post = servicePosts.find((s) => s.id === postId);
    if (post) {
      post.status = 'rejected';
      toast.info('Service post rejected.');
      forceUpdate((n) => n + 1);
    }
  };

  const handleAwardPoints = () => {
    if (!rewardUserId || !rewardPoints) { toast.error('Select a volunteer and enter points.'); return; }
    const user = users.find((u) => u.id === rewardUserId);
    const pts = parseInt(rewardPoints);
    if (user && pts > 0) {
      user.rewardPoints += pts;
      addNotification({ type: 'reward', title: '🎁 Points Awarded!', message: `You earned ${pts} reward points!`, userId: user.id });
      toast.success(`${pts} points awarded to ${user.name}!`);
      setRewardUserId('');
      setRewardPoints('');
      forceUpdate((n) => n + 1);
    }
  };

  const sortedByActivities = [...volunteers].sort((a, b) => b.activitiesCompleted - a.activitiesCompleted);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin Header */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-primary">YuvaSeva Admin Panel</h3>
            <p className="text-sm text-muted-foreground">
              Manage alerts, services, rewards, attendance, and expulsions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Dialog open={alertDialog} onOpenChange={setAlertDialog}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-soft transition-shadow border-urgent/30 hover:border-urgent/50">
              <CardContent className="flex items-center gap-3 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-urgent/10">
                  <Megaphone className="h-5 w-5 text-urgent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Post Alert</p>
                  <p className="text-xs text-muted-foreground">Emergency request</p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-urgent" />
                Post Urgent Alert
              </DialogTitle>
              <DialogDescription>This will appear on the Home Page immediately.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2 max-h-[60vh] overflow-y-auto">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input placeholder="e.g., Blood Donation Required" value={newAlert.title} onChange={(e) => setNewAlert((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Description *</Label>
                <Textarea placeholder="Describe the urgent need..." value={newAlert.description} onChange={(e) => setNewAlert((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Urgency Level</Label>
                  <Select value={newAlert.urgencyLevel} onValueChange={(v) => setNewAlert((p) => ({ ...p, urgencyLevel: v as any }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">🔴 Critical</SelectItem>
                      <SelectItem value="high">🟠 High</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Input placeholder="e.g., Blood Donation" value={newAlert.category} onChange={(e) => setNewAlert((p) => ({ ...p, category: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Contact *</Label>
                  <Input placeholder="+91 ..." value={newAlert.contact} onChange={(e) => setNewAlert((p) => ({ ...p, contact: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input placeholder="Hospital name, area" value={newAlert.location} onChange={(e) => setNewAlert((p) => ({ ...p, location: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Blood Group</Label>
                  <Input placeholder="e.g., O-, B+" value={newAlert.bloodGroup} onChange={(e) => setNewAlert((p) => ({ ...p, bloodGroup: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Help Type</Label>
                  <Input placeholder="e.g., Blood Donation" value={newAlert.helpType} onChange={(e) => setNewAlert((p) => ({ ...p, helpType: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Person/Organization in Need</Label>
                <Input placeholder="Name of person or org" value={newAlert.personInNeed} onChange={(e) => setNewAlert((p) => ({ ...p, personInNeed: e.target.value }))} />
              </div>
              <Button onClick={handlePostAlert} className="w-full bg-urgent hover:bg-urgent/90 text-urgent-foreground">
                Post Alert
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Card className="border-primary/20">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Pending Services</p>
              <p className="text-xs text-muted-foreground">{pendingServices.length} to review</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/20">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <Gift className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="font-semibold text-sm">Reward Points</p>
              <p className="text-xs text-muted-foreground">Manage manually</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <UsersIcon className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-semibold text-sm">Volunteers</p>
              <p className="text-xs text-muted-foreground">{volunteers.length} active</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approve Service Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-accent" />
            Volunteer Service Posts
          </CardTitle>
          <p className="text-sm text-muted-foreground">Approve or reject volunteer service submissions.</p>
        </CardHeader>
        <CardContent>
          {pendingServices.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">No pending service posts.</p>
          ) : (
            <div className="space-y-3">
              {pendingServices.map((post) => (
                <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-background">
                  <div className="flex-1">
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground">{post.volunteerName} • {new Date(post.date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-success" onClick={() => handleApproveService(post.id)}>
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleRejectService(post.id)}>
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Reward Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gift className="h-5 w-5 text-warning" />
            Award Reward Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={rewardUserId} onValueChange={setRewardUserId}>
              <SelectTrigger className="sm:w-[200px]"><SelectValue placeholder="Select volunteer" /></SelectTrigger>
              <SelectContent>
                {volunteers.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.name} ({v.rewardPoints} pts)</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Points" value={rewardPoints} onChange={(e) => setRewardPoints(e.target.value)} className="sm:w-[120px]" />
            <Button onClick={handleAwardPoints} className="gap-1">
              <Gift className="h-4 w-4" /> Award
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Race Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-primary" />
            Activity Race — First to {ACTIVITY_GOAL} Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedByActivities.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">No volunteers yet.</p>
          ) : (
            <div className="space-y-4">
              {sortedByActivities.map((v, idx) => {
                const progress = Math.min((v.activitiesCompleted / ACTIVITY_GOAL) * 100, 100);
                const isCompleted = v.activitiesCompleted >= ACTIVITY_GOAL;
                return (
                  <div key={v.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">#{idx + 1}</span>
                        <span className="font-medium">{v.name}</span>
                        <span className="text-muted-foreground">({v.rollNumber})</span>
                        {isCompleted && <Badge className="bg-primary/20 text-primary border-0 text-xs">🏆 Goal Reached!</Badge>}
                        {expelled[v.id] && <Badge variant="destructive" className="text-xs">Expelled</Badge>}
                      </div>
                      <span className="font-medium">{v.activitiesCompleted} / {ACTIVITY_GOAL}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expulsion Management */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Inactivity & Expulsion (2-Chance System)
          </CardTitle>
          <p className="text-sm text-muted-foreground">Volunteers who don't attend or organize an event within 1 week get a warning. After 2 warnings they are expelled.</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Warnings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((v) => {
                const w = warnings[v.id] || 0;
                const isExpelled = expelled[v.id] || false;
                return (
                  <TableRow key={v.id} className={isExpelled ? 'bg-destructive/5 opacity-60' : w > 0 ? 'bg-warning/5' : ''}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell className="text-muted-foreground">{v.rollNumber}</TableCell>
                    <TableCell><Badge variant="outline">{v.rewardPoints} pts</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {[0, 1].map((i) => (
                          <div key={i} className={`h-3 w-3 rounded-full ${i < w ? 'bg-destructive' : 'bg-muted'}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isExpelled ? (
                        <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Expelled</Badge>
                      ) : w > 0 ? (
                        <Badge className="bg-warning/20 text-warning border-0">Warning {w}/2</Badge>
                      ) : (
                        <Badge variant="outline" className="text-primary border-primary/30">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" disabled={isExpelled} onClick={() => issueWarning(v.id, v.name)}>
                        {isExpelled ? 'Expelled' : `Issue Warning (${w}/2)`}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mark Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-primary" />
            Roll Call — Mark Attendance
          </CardTitle>
          <p className="text-sm text-muted-foreground">Select an event and mark volunteers present.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger><SelectValue placeholder="Select an event" /></SelectTrigger>
            <SelectContent>
              {approvedEvents.length === 0 ? (
                <SelectItem value="none" disabled>No approved events available</SelectItem>
              ) : (
                approvedEvents.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.title} — {new Date(e.proposedDate).toLocaleDateString()}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Present</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((v) => (
                <TableRow key={v.id} className={attendance[v.id] ? 'bg-primary/5' : ''}>
                  <TableCell>
                    <Checkbox checked={!!attendance[v.id]} onCheckedChange={() => toggleAttendance(v.id)} disabled={!selectedEvent} />
                  </TableCell>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-muted-foreground">{v.rollNumber}</TableCell>
                  <TableCell>
                    {attendance[v.id] ? (
                      <Badge className="bg-primary/20 text-primary border-0">Present</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Absent</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!selectedEvent && <p className="text-sm text-muted-foreground text-center">Select an event above to mark attendance.</p>}
          {selectedEvent && (
            <Button onClick={handleSaveAttendance} className="shadow-glow">
              Save Attendance ({Object.values(attendance).filter(Boolean).length} present)
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
