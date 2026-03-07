import { useState } from 'react';
import { User } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { History, Plus, Clock, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface PreviousEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  hours: number;
  certificateFile?: string;
}

interface PreviousEventsProps {
  user: User;
}

export function PreviousEvents({ user }: PreviousEventsProps) {
  const [events, setEvents] = useState<PreviousEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', date: '', category: '', hours: '',
  });
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certPreview, setCertPreview] = useState<string>('');

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCertPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!form.title || !form.date) {
      toast.error('Please fill in at least title and date.');
      return;
    }
    const newEvent: PreviousEvent = {
      id: String(Date.now()),
      title: form.title,
      description: form.description,
      date: form.date,
      category: form.category || 'General',
      hours: parseFloat(form.hours) || 0,
      certificateFile: certPreview || undefined,
    };
    setEvents((prev) => [newEvent, ...prev]);
    setForm({ title: '', description: '', date: '', category: '', hours: '' });
    setCertFile(null);
    setCertPreview('');
    setDialogOpen(false);
    toast.success('Previous event added to your record!');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Previous Events
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Previous Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Previous Event</DialogTitle>
                <DialogDescription>Manually add a past event to your volunteer record.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Event Title *</Label>
                  <Input placeholder="e.g., Blood Donation Camp" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe your participation..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hours Contributed</Label>
                    <Input type="number" min="0" step="0.5" placeholder="e.g., 4" value={form.hours} onChange={(e) => setForm((p) => ({ ...p, hours: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input placeholder="e.g., Blood Drive, Cleanup" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Upload Certificate (optional)</Label>
                  <Input type="file" accept="image/*,.pdf" onChange={handleCertUpload} />
                  {certPreview && certFile?.type.startsWith('image/') && (
                    <img src={certPreview} alt="Certificate" className="h-20 rounded-md object-cover mt-2" />
                  )}
                </div>
                <Button onClick={handleAdd} className="w-full">Add to Record</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <History className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No previous events added yet.</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Add your past volunteer activities to build your record.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {events.map((event) => (
                <div key={event.id} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                  <div className="p-4 rounded-lg border hover:shadow-soft transition-shadow">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          {event.hours > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.hours}h
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">{event.category}</Badge>
                        {event.certificateFile && (
                          <Badge className="bg-success/10 text-success border-0">
                            <FileText className="h-3 w-3 mr-1" />
                            Cert
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
