import { useState } from 'react';
import { User } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export interface Internship {
  id: string;
  volunteerId: string;
  volunteerName: string;
  organization: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Shared store
export const internships: Internship[] = [];

interface SocialInternshipProps {
  user: User;
}

export function SocialInternship({ user }: SocialInternshipProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    organization: '', title: '', startDate: '', endDate: '', description: '',
  });
  const [, forceUpdate] = useState(0);

  const myInternships = internships.filter(i => i.volunteerId === user.id);

  const handleSubmit = () => {
    if (!form.organization || !form.title || !form.startDate || !form.endDate) {
      toast.error('Please fill all required fields.');
      return;
    }
    internships.push({
      id: String(Date.now()),
      volunteerId: user.id,
      volunteerName: user.name,
      ...form,
      status: 'pending',
    });
    setForm({ organization: '', title: '', startDate: '', endDate: '', description: '' });
    setDialogOpen(false);
    forceUpdate(n => n + 1);
    toast.success('Internship submitted for approval.');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Social Internship</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Track your social internship activities.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1"><Plus className="h-4 w-4" /> Add Internship</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Social Internship</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label>Organization Name *</Label>
                  <Input placeholder="e.g., Red Cross Society" value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Internship Title *</Label>
                  <Input placeholder="e.g., Community Health Worker" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Start Date *</Label>
                    <Input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>End Date *</Label>
                    <Input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description of Social Work</Label>
                  <Textarea placeholder="Describe your contributions..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                </div>
                <Button onClick={handleSubmit} className="w-full">Submit for Approval</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {myInternships.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">No internships added yet.</p>
        ) : (
          <div className="space-y-3">
            {myInternships.map(intern => (
              <div key={intern.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{intern.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {intern.organization} • {new Date(intern.startDate).toLocaleDateString()} – {new Date(intern.endDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    intern.status === 'approved' ? 'bg-success/10 text-success border-success/20' :
                    intern.status === 'rejected' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                    'bg-warning/10 text-warning border-warning/20'
                  }
                >
                  {intern.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
