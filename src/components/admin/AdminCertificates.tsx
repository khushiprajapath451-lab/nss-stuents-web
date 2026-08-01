import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import {
  fetchProfiles, fetchEventProposals, fetchAllCertificates, createCertificate,
  createNotification, DbProfile, DbEventProposal, DbCertificate,
} from '@/lib/supabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, Download } from 'lucide-react';
import { toast } from 'sonner';

export function AdminCertificates() {
  const [profiles, setProfiles] = useState<DbProfile[]>([]);
  const [events, setEvents] = useState<DbEventProposal[]>([]);
  const [certs, setCerts] = useState<DbCertificate[]>([]);
  const [form, setForm] = useState({ userId: '', eventName: '', hours: '', type: 'participation' });

  const load = async () => {
    try {
      const [p, e, c] = await Promise.all([fetchProfiles(), fetchEventProposals(), fetchAllCertificates()]);
      setProfiles(p.filter(x => x.role === 'volunteer'));
      setEvents(e);
      setCerts(c);
    } catch { /* ignore */ }
  };
  useEffect(() => { load(); }, []);

  const nameOf = (id: string) => profiles.find(p => p.id === id)?.name || 'Volunteer';
  const rollOf = (id: string) => profiles.find(p => p.id === id)?.roll_number || '';

  const generate = async () => {
    if (!form.userId || !form.eventName) { toast.error('Select a volunteer and an event.'); return; }
    try {
      await createCertificate({
        user_id: form.userId,
        event_name: form.eventName,
        date: new Date().toISOString().slice(0, 10),
        hours: Number(form.hours || 0),
        type: form.type,
      });
      await createNotification({
        type: 'certificate', title: 'Certificate Issued',
        message: `Your certificate for "${form.eventName}" is ready.`, user_id: form.userId,
      });
      toast.success('Certificate generated.');
      setForm({ userId: '', eventName: '', hours: '', type: 'participation' });
      load();
    } catch { toast.error('Could not generate certificate.'); }
  };

  const download = (c: DbCertificate) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(6);
    doc.rect(24, 24, W - 48, H - 48);
    doc.setLineWidth(1);
    doc.rect(38, 38, W - 76, H - 76);

    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.text('NATIONAL SERVICE SCHEME', W / 2, 120, { align: 'center' });
    doc.setFontSize(18);
    doc.text('Certificate of ' + c.type.charAt(0).toUpperCase() + c.type.slice(1), W / 2, 158, { align: 'center' });

    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('This is to certify that', W / 2, 215, { align: 'center' });

    doc.setTextColor(20, 20, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.text(nameOf(c.user_id), W / 2, 255, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(90, 90, 90);
    doc.text(`Roll No: ${rollOf(c.user_id)}`, W / 2, 278, { align: 'center' });

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(14);
    doc.text(
      `has successfully participated in "${c.event_name}" and contributed ${c.hours} service hour(s)`,
      W / 2, 320, { align: 'center', maxWidth: W - 180 },
    );

    doc.setFontSize(12);
    doc.text(`Date: ${new Date(c.date).toLocaleDateString()}`, 90, H - 90);
    doc.text('NSS Programme Officer', W - 90, H - 90, { align: 'right' });

    doc.save(`NSS_Certificate_${rollOf(c.user_id) || nameOf(c.user_id)}.pdf`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-primary" /> Generate Certificate
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1.5 lg:col-span-1">
            <Label>Volunteer</Label>
            <Select value={form.userId} onValueChange={v => setForm(p => ({ ...p, userId: v }))}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.roll_number})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 lg:col-span-2">
            <Label>Event</Label>
            <Select value={form.eventName} onValueChange={v => setForm(p => ({ ...p, eventName: v }))}>
              <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
              <SelectContent>
                {events.length === 0
                  ? <SelectItem value="none" disabled>No events available</SelectItem>
                  : events.map(e => <SelectItem key={e.id} value={e.title}>{e.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Hours</Label>
            <Input type="number" min={0} value={form.hours} onChange={e => setForm(p => ({ ...p, hours: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="participation">Participation</SelectItem>
                <SelectItem value="excellence">Excellence</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 lg:col-span-5">
            <Button onClick={generate} className="gap-1"><Award className="h-4 w-4" /> Generate Certificate</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Issued Certificates</CardTitle></CardHeader>
        <CardContent>
          {certs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No certificates issued yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Volunteer</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certs.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{nameOf(c.user_id)}</TableCell>
                    <TableCell className="text-muted-foreground">{rollOf(c.user_id)}</TableCell>
                    <TableCell>{c.event_name}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{c.type}</Badge></TableCell>
                    <TableCell className="text-right">{c.hours}h</TableCell>
                    <TableCell>{new Date(c.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => download(c)}>
                        <Download className="h-4 w-4" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
