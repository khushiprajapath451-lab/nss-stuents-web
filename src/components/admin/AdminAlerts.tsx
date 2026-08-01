import { useEffect, useState } from 'react';
import {
  fetchUrgentAlerts, createUrgentAlert, createNotification, DbUrgentAlert,
} from '@/lib/supabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Megaphone } from 'lucide-react';
import { toast } from 'sonner';

const emptyAlert = {
  title: '', description: '', urgency_level: 'high',
  category: '', contact: '', location: '', blood_group: '', help_type: '', person_in_need: '',
};

export function AdminAlerts() {
  const [alerts, setAlerts] = useState<DbUrgentAlert[]>([]);
  const [open, setOpen] = useState(false);
  const [newAlert, setNewAlert] = useState(emptyAlert);

  const load = async () => {
    try { setAlerts(await fetchUrgentAlerts()); } catch { /* ignore */ }
  };
  useEffect(() => { load(); }, []);

  const post = async () => {
    if (!newAlert.title || !newAlert.description || !newAlert.contact) {
      toast.error('Title, description, and contact are required.');
      return;
    }
    await createUrgentAlert(newAlert);
    await createNotification({ type: 'alert', title: '🚨 New Urgent Alert', message: newAlert.title, user_id: null });
    setNewAlert(emptyAlert);
    setOpen(false);
    toast.success('Alert posted! It will appear on the Home Page immediately.');
    load();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Megaphone className="h-5 w-5 text-urgent" /> Urgent Alerts
          </CardTitle>
          <p className="text-sm text-muted-foreground">Emergency requests shown on the Home page.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-urgent hover:bg-urgent/90 text-urgent-foreground gap-1">
              <Megaphone className="h-4 w-4" /> Post Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-urgent" />Post Urgent Alert</DialogTitle>
              <DialogDescription>This will appear on the Home Page immediately.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2 max-h-[60vh] overflow-y-auto">
              <div className="space-y-1.5"><Label>Title *</Label><Input value={newAlert.title} onChange={e => setNewAlert(p => ({ ...p, title: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Description *</Label><Textarea value={newAlert.description} onChange={e => setNewAlert(p => ({ ...p, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Urgency Level</Label>
                  <Select value={newAlert.urgency_level} onValueChange={v => setNewAlert(p => ({ ...p, urgency_level: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">🔴 Critical</SelectItem>
                      <SelectItem value="high">🟠 High</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Category</Label><Input value={newAlert.category} onChange={e => setNewAlert(p => ({ ...p, category: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Contact *</Label><Input value={newAlert.contact} onChange={e => setNewAlert(p => ({ ...p, contact: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Location</Label><Input value={newAlert.location} onChange={e => setNewAlert(p => ({ ...p, location: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Blood Group</Label><Input value={newAlert.blood_group} onChange={e => setNewAlert(p => ({ ...p, blood_group: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Help Type</Label><Input value={newAlert.help_type} onChange={e => setNewAlert(p => ({ ...p, help_type: e.target.value }))} /></div>
              </div>
              <div className="space-y-1.5"><Label>Person/Organization in Need</Label><Input value={newAlert.person_in_need} onChange={e => setNewAlert(p => ({ ...p, person_in_need: e.target.value }))} /></div>
              <Button onClick={post} className="w-full bg-urgent hover:bg-urgent/90 text-urgent-foreground">Post Alert</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No urgent alerts posted.</p>
        ) : alerts.map(a => (
          <div key={a.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{a.title}</p>
              <Badge variant="outline" className="capitalize text-urgent border-urgent/40">{a.urgency_level}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {a.category ? `${a.category} • ` : ''}{a.contact}{a.location ? ` • ${a.location}` : ''} • {new Date(a.posted_at).toLocaleString()}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
