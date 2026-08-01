import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  fetchProfiles, fetchEventProposals, fetchAttendanceRecords, createAttendanceRecord,
  createNotification, updateProfile, fetchProfile,
  DbProfile, DbEventProposal, DbAttendanceRecord, POINTS,
} from '@/lib/supabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Download, History } from 'lucide-react';
import { toast } from 'sonner';

export function AdminAttendance() {
  const [profiles, setProfiles] = useState<DbProfile[]>([]);
  const [events, setEvents] = useState<DbEventProposal[]>([]);
  const [records, setRecords] = useState<DbAttendanceRecord[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const load = async () => {
    try {
      const [p, e, r] = await Promise.all([fetchProfiles(), fetchEventProposals(), fetchAttendanceRecords()]);
      setProfiles(p.filter(x => x.role === 'volunteer'));
      setEvents(e.filter(x => x.status === 'approved' || x.status === 'completed'));
      setRecords(r);
    } catch { /* ignore */ }
  };
  useEffect(() => { load(); }, []);

  const totalSessions = records.length;
  const attendedCount = (id: string) => records.filter(r => r.present_volunteer_ids.includes(id)).length;
  const percentage = (id: string) => (totalSessions ? Math.round((attendedCount(id) / totalSessions) * 100) : 0);

  const save = async () => {
    const event = events.find(e => e.id === selectedEvent);
    if (!event) { toast.error('Please select an event first.'); return; }
    const presentIds = Object.entries(attendance).filter(([, v]) => v).map(([id]) => id);
    await createAttendanceRecord({
      event_id: event.id, event_title: event.title, event_date: event.proposed_date || '',
      present_volunteer_ids: presentIds, claimed_by: {},
    });
    for (const id of presentIds) {
      try {
        const p = await fetchProfile(id);
        await updateProfile(id, {
          reward_points: p.reward_points + POINTS.EVENT_PARTICIPATION,
          events_attended: p.events_attended + 1,
          last_activity_date: new Date().toISOString(),
        });
      } catch { /* ignore */ }
    }
    await createNotification({
      type: 'event', title: 'Attendance Marked',
      message: `Roll call saved for "${event.title}". ${presentIds.length} volunteer(s) present, +${POINTS.EVENT_PARTICIPATION} points each.`,
      user_id: null,
    });
    toast.success(`Roll call saved for ${presentIds.length} volunteer(s).`);
    setAttendance({});
    setSelectedEvent('');
    load();
  };

  const exportExcel = () => {
    if (records.length === 0) { toast.error('No attendance records to export.'); return; }
    const grouped: Record<string, any[]> = {};
    records.forEach(record => {
      record.present_volunteer_ids.forEach(vid => {
        const p = profiles.find(u => u.id === vid);
        if (!p) return;
        const key = `${p.branch}-${p.section}`;
        (grouped[key] ||= []).push({
          'Event Title': record.event_title,
          'Event Date': record.event_date,
          'Roll Number': p.roll_number,
          'Name': p.name,
          'Branch': p.branch,
          'Section': p.section,
          'Attendance %': `${percentage(p.id)}%`,
        });
      });
    });
    const wb = XLSX.utils.book_new();
    const names = Object.keys(grouped).sort();
    if (names.length === 0) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{ Info: 'No data' }]), 'All');
    else names.forEach(n => XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(grouped[n]), n));
    XLSX.writeFile(wb, 'NSS_Attendance_Report.xlsx');
    toast.success('Attendance report downloaded.');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="h-5 w-5 text-primary" /> Roll Call — Mark Attendance
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-1" onClick={exportExcel}>
              <Download className="h-4 w-4" /> Export to Excel
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Marking present awards +{POINTS.EVENT_PARTICIPATION} participation points automatically.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger><SelectValue placeholder="Select an event" /></SelectTrigger>
            <SelectContent>
              {events.length === 0
                ? <SelectItem value="none" disabled>No events available</SelectItem>
                : events.map(e => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.title}{e.proposed_date ? ` — ${new Date(e.proposed_date).toLocaleDateString()}` : ''}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Present</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead className="w-48">Attendance %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map(v => (
                <TableRow key={v.id} className={attendance[v.id] ? 'bg-primary/5' : ''}>
                  <TableCell>
                    <Checkbox
                      checked={!!attendance[v.id]}
                      onCheckedChange={() => setAttendance(p => ({ ...p, [v.id]: !p[v.id] }))}
                      disabled={!selectedEvent}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-muted-foreground">{v.roll_number}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={percentage(v.id)} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground w-20">{percentage(v.id)}% ({attendedCount(v.id)}/{totalSessions})</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!selectedEvent
            ? <p className="text-sm text-muted-foreground text-center">Select an event above to mark attendance.</p>
            : <Button onClick={save} className="shadow-glow">Save Attendance ({Object.values(attendance).filter(Boolean).length} present)</Button>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-primary" /> Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {records.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No attendance records yet.</p>
          ) : records.map(r => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="font-medium text-sm">{r.event_title}</p>
                <p className="text-xs text-muted-foreground">
                  {r.event_date ? new Date(r.event_date).toLocaleDateString() : ''} • marked {new Date(r.marked_at).toLocaleString()}
                </p>
              </div>
              <Badge variant="outline">{r.present_volunteer_ids.length} present</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
