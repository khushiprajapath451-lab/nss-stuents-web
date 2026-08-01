import { useEffect, useState } from 'react';
import {
  fetchEventProposals, createEventProposal, updateEventProposal, deleteEventProposal,
  fetchAttendanceRecords, createNotification,
  DbEventProposal, DbAttendanceRecord,
} from '@/lib/supabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { CalendarDays, Plus, Pencil, Trash2, Check, Users, Lock } from 'lucide-react';
import { toast } from 'sonner';

const empty = { title: '', description: '', proposed_date: '', time: '', location: '' };

export function AdminEventManagement() {
  const [events, setEvents] = useState<DbEventProposal[]>([]);
  const [records, setRecords] = useState<DbAttendanceRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    try {
      const [e, r] = await Promise.all([fetchEventProposals(), fetchAttendanceRecords()]);
      setEvents(e);
      setRecords(r);
    } catch { /* ignore */ }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (e: DbEventProposal) => {
    setEditId(e.id);
    setForm({
      title: e.title, description: e.description, proposed_date: e.proposed_date || '',
      time: e.time || '', location: e.location || '',
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.proposed_date) { toast.error('Title and date are required.'); return; }
    try {
      if (editId) {
        await updateEventProposal(editId, form);
        toast.success('Event updated.');
      } else {
        await createEventProposal({
          ...form, proposed_by: 'Admin', votes: 0, voters: [], status: 'approved',
        });
        await createNotification({ type: 'event', title: 'New Event Published', message: form.title, user_id: null });
        toast.success('Event created and published.');
      }
      setOpen(false);
      load();
    } catch { toast.error('Could not save event.'); }
  };

  const remove = async (id: string) => {
    await deleteEventProposal(id);
    toast.success('Event deleted.');
    load();
  };

  const approve = async (e: DbEventProposal) => {
    await updateEventProposal(e.id, { status: 'approved' });
    await createNotification({ type: 'event', title: 'Event Approved', message: e.title, user_id: null });
    toast.success('Event approved and published.');
    load();
  };

  const close = async (e: DbEventProposal) => {
    await updateEventProposal(e.id, { status: 'completed' });
    toast.success('Event closed.');
    load();
  };

  const attendeesFor = (eventId: string) =>
    records.filter(r => r.event_id === eventId).reduce((s, r) => s + r.present_volunteer_ids.length, 0);

  const statusBadge = (s: string) => {
    if (s === 'approved') return <Badge className="bg-primary/15 text-primary border-0">Published</Badge>;
    if (s === 'completed') return <Badge className="bg-success/15 text-success border-0">Closed</Badge>;
    return <Badge variant="outline" className="text-warning border-warning/40">Pending</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5 text-primary" /> Event Management
          </CardTitle>
          <p className="text-sm text-muted-foreground">Create, edit, approve, and close NSS events.</p>
        </div>
        <Button onClick={openNew} className="gap-1"><Plus className="h-4 w-4" /> New Event</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No events yet.</p>
        ) : events.map(e => (
          <div key={e.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{e.title}</p>
                {statusBadge(e.status)}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{e.description}</p>
              <p className="text-xs text-muted-foreground">
                {e.proposed_date ? new Date(e.proposed_date).toLocaleDateString() : 'Date TBD'}
                {e.time ? ` • ${e.time}` : ''}{e.location ? ` • ${e.location}` : ''}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> {attendeesFor(e.id)} attendance marked • {e.votes} votes
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {e.status === 'pending' && (
                <Button size="sm" variant="ghost" className="text-success" onClick={() => approve(e)}>
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
              )}
              {e.status === 'approved' && (
                <Button size="sm" variant="ghost" onClick={() => close(e)}>
                  <Lock className="h-4 w-4 mr-1" /> Close
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => openEdit(e)}><Pencil className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(e.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Event' : 'Create Event'}</DialogTitle>
            <DialogDescription>Published events appear on the Home page and volunteer dashboard.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Event Name *</Label>
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Date *</Label>
                <Input type="date" value={form.proposed_date} onChange={e => setForm(p => ({ ...p, proposed_date: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Time</Label>
                <Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} /></div>
            </div>
            <div className="space-y-1.5"><Label>Venue</Label>
              <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></div>
            <Button className="w-full" onClick={save}>{editId ? 'Save Changes' : 'Create Event'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
