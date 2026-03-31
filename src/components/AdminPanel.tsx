import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  fetchProfiles, fetchEventProposals, fetchServicePosts, fetchAttendanceRecords,
  createUrgentAlert, createAttendanceRecord, createNotification,
  updateServicePost, updateProfile, fetchProfile,
  DbProfile, DbEventProposal, DbServicePost, DbAttendanceRecord,
  dbProfileToUser, ACTIVITY_GOAL, POINTS,
} from '@/lib/supabaseData';
import { InviteAnalytics } from '@/components/InviteAnalytics';
import { EventExpensePlanner } from '@/components/EventExpensePlanner';
import { MyBharatAdmin } from '@/components/MyBharatAdmin';
import { InternshipApprovals } from '@/components/InternshipApprovals';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertTriangle, CheckCircle, Shield, Trophy, Users as UsersIcon, XCircle,
  Plus, Megaphone, Heart, Check, X, Gift, Download, Link2, ClipboardList, Globe, Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminPanel() {
  const [volunteers, setVolunteers] = useState<ReturnType<typeof dbProfileToUser>[]>([]);
  const [approvedEvents, setApprovedEvents] = useState<DbEventProposal[]>([]);
  const [pendingServices, setPendingServices] = useState<DbServicePost[]>([]);
  const [attendRecords, setAttendRecords] = useState<DbAttendanceRecord[]>([]);

  const [selectedEvent, setSelectedEvent] = useState('');
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [warnings, setWarnings] = useState<Record<string, number>>({});
  const [expelled, setExpelled] = useState<Record<string, boolean>>({});
  const [alertDialog, setAlertDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '', description: '', urgency_level: 'high' as string,
    category: '', contact: '', location: '', blood_group: '', help_type: '', person_in_need: '',
  });
  const [rewardUserId, setRewardUserId] = useState('');
  const [rewardPoints, setRewardPoints] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profiles, proposals, services, records] = await Promise.all([
        fetchProfiles(), fetchEventProposals(), fetchServicePosts(), fetchAttendanceRecords(),
      ]);
      setVolunteers(profiles.filter(p => p.role === 'volunteer').map(dbProfileToUser));
      setApprovedEvents(proposals.filter(p => p.status === 'approved'));
      setPendingServices(services.filter(s => s.status === 'pending'));
      setAttendRecords(records);
    } catch {}
  };

  const toggleAttendance = (userId: string) => {
    setAttendance(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const issueWarning = (userId: string, userName: string) => {
    setWarnings(prev => {
      const current = prev[userId] || 0;
      const next = current + 1;
      if (next >= 2) {
        setExpelled(ep => ({ ...ep, [userId]: true }));
        toast.error(`${userName} has been expelled from NSS after 2 warnings.`);
      } else {
        toast.warning(`Warning ${next}/2 issued to ${userName}.`);
      }
      return { ...prev, [userId]: next };
    });
  };

  const handleSaveAttendance = async () => {
    if (!selectedEvent) { toast.error('Please select an event first.'); return; }
    const event = approvedEvents.find(e => e.id === selectedEvent);
    if (event) {
      const presentIds = Object.entries(attendance).filter(([, p]) => p).map(([id]) => id);
      await createAttendanceRecord({
        event_id: event.id, event_title: event.title, event_date: event.proposed_date || '',
        present_volunteer_ids: presentIds, claimed_by: {},
      });
      await createNotification({
        type: 'event', title: 'Attendance Marked',
        message: `Roll call saved for "${event.title}". ${presentIds.length} volunteer(s) present.`,
        user_id: null,
      });
    }
    toast.success(`Roll call saved: ${Object.values(attendance).filter(Boolean).length} volunteer(s) marked present.`);
    setAttendance({});
    setSelectedEvent('');
    loadData();
  };

  const handlePostAlert = async () => {
    if (!newAlert.title || !newAlert.description || !newAlert.contact) {
      toast.error('Title, description, and contact are required.');
      return;
    }
    await createUrgentAlert(newAlert);
    await createNotification({ type: 'alert', title: '🚨 New Urgent Alert', message: newAlert.title, user_id: null });
    setNewAlert({ title: '', description: '', urgency_level: 'high', category: '', contact: '', location: '', blood_group: '', help_type: '', person_in_need: '' });
    setAlertDialog(false);
    toast.success('Alert posted! It will appear on the Home Page immediately.');
  };

  const handleApproveService = async (postId: string) => {
    const post = pendingServices.find(s => s.id === postId);
    if (post) {
      await updateServicePost(postId, { status: 'approved', points_awarded: POINTS.SERVICE_POST_APPROVED });
      const profile = await fetchProfile(post.volunteer_id);
      await updateProfile(post.volunteer_id, { reward_points: profile.reward_points + POINTS.SERVICE_POST_APPROVED });
      await createNotification({ type: 'service', title: 'Service Approved', message: `"${post.title}" by ${post.volunteer_name} has been approved!`, user_id: post.volunteer_id });
      toast.success(`Service post approved! ${post.volunteer_name} earned ${POINTS.SERVICE_POST_APPROVED} points.`);
      loadData();
    }
  };

  const handleRejectService = async (postId: string) => {
    await updateServicePost(postId, { status: 'rejected' });
    toast.info('Service post rejected.');
    loadData();
  };

  const handleAwardPoints = async () => {
    if (!rewardUserId || !rewardPoints) { toast.error('Select a volunteer and enter points.'); return; }
    const pts = parseInt(rewardPoints);
    if (pts > 0) {
      const profile = await fetchProfile(rewardUserId);
      await updateProfile(rewardUserId, { reward_points: profile.reward_points + pts });
      await createNotification({ type: 'reward', title: '🎁 Points Awarded!', message: `You earned ${pts} reward points!`, user_id: rewardUserId });
      toast.success(`${pts} points awarded!`);
      setRewardUserId('');
      setRewardPoints('');
      loadData();
    }
  };

  const handleDownloadAttendanceExcel = async () => {
    if (attendRecords.length === 0) { toast.error('No attendance records to download.'); return; }
    const allProfiles = await fetchProfiles();
    const grouped: Record<string, any[]> = {};
    attendRecords.forEach(record => {
      record.present_volunteer_ids.forEach(vid => {
        const p = allProfiles.find(u => u.id === vid);
        if (!p) return;
        const key = `${p.branch}-${p.section}`;
        if (!grouped[key]) grouped[key] = [];
        const cb = record.claimed_by as Record<string, any>;
        const claim = cb[vid];
        grouped[key].push({
          'Event Title': record.event_title, 'Event Date': record.event_date,
          'Roll Number': p.roll_number, 'Name': p.name, 'Branch': p.branch, 'Section': p.section,
          'Role': claim ? (claim.role === 'organizer' ? 'Organizer' : 'Participant') : 'Present (Unclaimed)',
          'Claim Time': claim ? new Date(claim.claimedAt).toLocaleString() : '-',
        });
      });
    });
    const wb = XLSX.utils.book_new();
    const sheetNames = Object.keys(grouped).sort();
    if (sheetNames.length === 0) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{ 'Info': 'No data' }]), 'All');
    } else {
      sheetNames.forEach(name => XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(grouped[name]), name));
    }
    XLSX.writeFile(wb, 'YuvaSeva_Attendance_Report.xlsx');
    toast.success('Attendance Excel downloaded!');
  };

  return (
    <Tabs defaultValue="management" className="space-y-6 animate-fade-in">
      <TabsList className="grid w-full grid-cols-5 h-auto p-1">
        <TabsTrigger value="management" className="gap-2 py-3"><Shield className="h-4 w-4" /><span className="hidden sm:inline">Management</span><span className="sm:hidden">Manage</span></TabsTrigger>
        <TabsTrigger value="expenses" className="gap-2 py-3"><ClipboardList className="h-4 w-4" /><span className="hidden sm:inline">Expenses</span><span className="sm:hidden">Cost</span></TabsTrigger>
        <TabsTrigger value="mybharat" className="gap-2 py-3"><Globe className="h-4 w-4" /><span className="hidden sm:inline">MyBharat</span><span className="sm:hidden">Bharat</span></TabsTrigger>
        <TabsTrigger value="internships" className="gap-2 py-3"><Briefcase className="h-4 w-4" /><span className="hidden sm:inline">Internships</span><span className="sm:hidden">Intern</span></TabsTrigger>
        <TabsTrigger value="invite-analytics" className="gap-2 py-3"><Link2 className="h-4 w-4" /><span className="hidden sm:inline">Invites</span><span className="sm:hidden">Invite</span></TabsTrigger>
      </TabsList>

      <TabsContent value="management" className="space-y-6">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20"><Shield className="h-6 w-6 text-primary" /></div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary">YuvaSeva Admin Panel</h3>
              <p className="text-sm text-muted-foreground">Manage alerts, services, rewards, attendance, and expulsions.</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Dialog open={alertDialog} onOpenChange={setAlertDialog}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-soft transition-shadow border-urgent/30 hover:border-urgent/50">
                <CardContent className="flex items-center gap-3 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-urgent/10"><Megaphone className="h-5 w-5 text-urgent" /></div>
                  <div><p className="font-semibold text-sm">Post Alert</p><p className="text-xs text-muted-foreground">Emergency request</p></div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-urgent" />Post Urgent Alert</DialogTitle>
                <DialogDescription>This will appear on the Home Page immediately.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 pt-2 max-h-[60vh] overflow-y-auto">
                <div className="space-y-1.5"><Label>Title *</Label><Input placeholder="e.g., Blood Donation Required" value={newAlert.title} onChange={(e) => setNewAlert(p => ({ ...p, title: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Description *</Label><Textarea placeholder="Describe the urgent need..." value={newAlert.description} onChange={(e) => setNewAlert(p => ({ ...p, description: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Urgency Level</Label>
                    <Select value={newAlert.urgency_level} onValueChange={(v) => setNewAlert(p => ({ ...p, urgency_level: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="critical">🔴 Critical</SelectItem><SelectItem value="high">🟠 High</SelectItem><SelectItem value="medium">🟡 Medium</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Category</Label><Input placeholder="e.g., Blood Donation" value={newAlert.category} onChange={(e) => setNewAlert(p => ({ ...p, category: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Contact *</Label><Input placeholder="+91 ..." value={newAlert.contact} onChange={(e) => setNewAlert(p => ({ ...p, contact: e.target.value }))} /></div>
                  <div className="space-y-1.5"><Label>Location</Label><Input placeholder="Hospital name, area" value={newAlert.location} onChange={(e) => setNewAlert(p => ({ ...p, location: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Blood Group</Label><Input placeholder="e.g., O-, B+" value={newAlert.blood_group} onChange={(e) => setNewAlert(p => ({ ...p, blood_group: e.target.value }))} /></div>
                  <div className="space-y-1.5"><Label>Help Type</Label><Input placeholder="e.g., Blood Donation" value={newAlert.help_type} onChange={(e) => setNewAlert(p => ({ ...p, help_type: e.target.value }))} /></div>
                </div>
                <div className="space-y-1.5"><Label>Person/Organization in Need</Label><Input placeholder="Name of person or org" value={newAlert.person_in_need} onChange={(e) => setNewAlert(p => ({ ...p, person_in_need: e.target.value }))} /></div>
                <Button onClick={handlePostAlert} className="w-full bg-urgent hover:bg-urgent/90 text-urgent-foreground">Post Alert</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Card className="border-primary/20"><CardContent className="flex items-center gap-3 py-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Heart className="h-5 w-5 text-primary" /></div><div><p className="font-semibold text-sm">Pending Services</p><p className="text-xs text-muted-foreground">{pendingServices.length} to review</p></div></CardContent></Card>
          <Card className="border-warning/20"><CardContent className="flex items-center gap-3 py-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10"><Gift className="h-5 w-5 text-warning" /></div><div><p className="font-semibold text-sm">Reward Points</p><p className="text-xs text-muted-foreground">Manage manually</p></div></CardContent></Card>
          <Card className="border-success/20"><CardContent className="flex items-center gap-3 py-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><UsersIcon className="h-5 w-5 text-success" /></div><div><p className="font-semibold text-sm">Volunteers</p><p className="text-xs text-muted-foreground">{volunteers.length} active</p></div></CardContent></Card>
        </div>

        {/* Service Posts */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Heart className="h-5 w-5 text-accent" />Volunteer Service Posts</CardTitle><p className="text-sm text-muted-foreground">Approve or reject volunteer service submissions.</p></CardHeader>
          <CardContent>
            {pendingServices.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No pending service posts.</p>
            ) : (
              <div className="space-y-3">
                {pendingServices.map(post => (
                  <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-background">
                    <div className="flex-1"><p className="font-medium">{post.title}</p><p className="text-sm text-muted-foreground">{post.volunteer_name} • {new Date(post.date).toLocaleDateString()}</p><p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.description}</p></div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-success" onClick={() => handleApproveService(post.id)}><Check className="h-4 w-4 mr-1" /> Approve</Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleRejectService(post.id)}><X className="h-4 w-4 mr-1" /> Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reward Points */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Gift className="h-5 w-5 text-warning" />Award Reward Points</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={rewardUserId} onValueChange={setRewardUserId}>
                <SelectTrigger className="sm:w-[200px]"><SelectValue placeholder="Select volunteer" /></SelectTrigger>
                <SelectContent>{volunteers.map(v => <SelectItem key={v.id} value={v.id}>{v.name} ({v.rewardPoints} pts)</SelectItem>)}</SelectContent>
              </Select>
              <Input type="number" placeholder="Points" value={rewardPoints} onChange={(e) => setRewardPoints(e.target.value)} className="sm:w-[120px]" />
              <Button onClick={handleAwardPoints} className="gap-1"><Gift className="h-4 w-4" /> Award</Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Race */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Trophy className="h-5 w-5 text-primary" />Activity Race — First to {ACTIVITY_GOAL} Activities</CardTitle></CardHeader>
          <CardContent>
            {volunteers.length === 0 ? <p className="text-muted-foreground text-sm text-center py-4">No volunteers yet.</p> : (
              <div className="space-y-4">
                {[...volunteers].sort((a, b) => b.activitiesCompleted - a.activitiesCompleted).map((v, idx) => {
                  const progress = Math.min((v.activitiesCompleted / ACTIVITY_GOAL) * 100, 100);
                  return (
                    <div key={v.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">#{idx + 1}</span><span className="font-medium">{v.name}</span><span className="text-muted-foreground">({v.rollNumber})</span>
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

        {/* Expulsion */}
        <Card className="border-destructive/30">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><AlertTriangle className="h-5 w-5 text-destructive" />Inactivity & Expulsion (2-Chance System)</CardTitle><p className="text-sm text-muted-foreground">Volunteers who don't attend or organize an event within 1 week get a warning.</p></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Roll Number</TableHead><TableHead>Points</TableHead><TableHead>Warnings</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {volunteers.map(v => {
                  const w = warnings[v.id] || 0;
                  const isExp = expelled[v.id] || false;
                  return (
                    <TableRow key={v.id} className={isExp ? 'bg-destructive/5 opacity-60' : w > 0 ? 'bg-warning/5' : ''}>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell className="text-muted-foreground">{v.rollNumber}</TableCell>
                      <TableCell><Badge variant="outline">{v.rewardPoints} pts</Badge></TableCell>
                      <TableCell><div className="flex gap-1">{[0,1].map(i => <div key={i} className={`h-3 w-3 rounded-full ${i < w ? 'bg-destructive' : 'bg-muted'}`} />)}</div></TableCell>
                      <TableCell>{isExp ? <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Expelled</Badge> : w > 0 ? <Badge className="bg-warning/20 text-warning border-0">Warning {w}/2</Badge> : <Badge variant="outline" className="text-primary border-primary/30">Active</Badge>}</TableCell>
                      <TableCell className="text-right"><Button variant="destructive" size="sm" disabled={isExp} onClick={() => issueWarning(v.id, v.name)}>{isExp ? 'Expelled' : `Issue Warning (${w}/2)`}</Button></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Roll Call */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg"><CheckCircle className="h-5 w-5 text-primary" />Roll Call — Mark Attendance</CardTitle>
              <Button variant="outline" size="sm" onClick={handleDownloadAttendanceExcel} className="gap-1"><Download className="h-4 w-4" /> Download Attendance Excel</Button>
            </div>
            <p className="text-sm text-muted-foreground">Select an event and mark volunteers present.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger><SelectValue placeholder="Select an event" /></SelectTrigger>
              <SelectContent>
                {approvedEvents.length === 0 ? <SelectItem value="none" disabled>No approved events available</SelectItem> : approvedEvents.map(e => <SelectItem key={e.id} value={e.id}>{e.title} — {e.proposed_date ? new Date(e.proposed_date).toLocaleDateString() : ''}</SelectItem>)}
              </SelectContent>
            </Select>
            <Table>
              <TableHeader><TableRow><TableHead className="w-12">Present</TableHead><TableHead>Name</TableHead><TableHead>Roll Number</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {volunteers.map(v => (
                  <TableRow key={v.id} className={attendance[v.id] ? 'bg-primary/5' : ''}>
                    <TableCell><Checkbox checked={!!attendance[v.id]} onCheckedChange={() => toggleAttendance(v.id)} disabled={!selectedEvent} /></TableCell>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell className="text-muted-foreground">{v.rollNumber}</TableCell>
                    <TableCell>{attendance[v.id] ? <Badge className="bg-primary/20 text-primary border-0">Present</Badge> : <Badge variant="outline" className="text-muted-foreground">Absent</Badge>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!selectedEvent && <p className="text-sm text-muted-foreground text-center">Select an event above to mark attendance.</p>}
            {selectedEvent && <Button onClick={handleSaveAttendance} className="shadow-glow">Save Attendance ({Object.values(attendance).filter(Boolean).length} present)</Button>}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="expenses" className="space-y-6"><EventExpensePlanner /></TabsContent>
      <TabsContent value="mybharat" className="space-y-6"><MyBharatAdmin /></TabsContent>
      <TabsContent value="internships" className="space-y-6"><InternshipApprovals /></TabsContent>
      <TabsContent value="invite-analytics"><InviteAnalytics /></TabsContent>
    </Tabs>
  );
}
