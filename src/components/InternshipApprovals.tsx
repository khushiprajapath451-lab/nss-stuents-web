import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { internships } from '@/components/SocialInternship';
import { toast } from 'sonner';
import { useState } from 'react';

export function InternshipApprovals() {
  const [, forceUpdate] = useState(0);
  const pending = internships.filter(i => i.status === 'pending');

  const handleApprove = (id: string) => {
    const intern = internships.find(i => i.id === id);
    if (intern) {
      intern.status = 'approved';
      toast.success(`Internship "${intern.title}" approved.`);
      forceUpdate(n => n + 1);
    }
  };

  const handleReject = (id: string) => {
    const intern = internships.find(i => i.id === id);
    if (intern) {
      intern.status = 'rejected';
      toast.info('Internship rejected.');
      forceUpdate(n => n + 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Internship Approvals</CardTitle>
        <p className="text-sm text-muted-foreground">Review social internship submissions.</p>
      </CardHeader>
      <CardContent>
        {pending.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">No pending internships.</p>
        ) : (
          <div className="space-y-3">
            {pending.map(intern => (
              <div key={intern.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium">{intern.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {intern.volunteerName} • {intern.organization}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(intern.startDate).toLocaleDateString()} – {new Date(intern.endDate).toLocaleDateString()}
                  </p>
                  {intern.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{intern.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="text-success" onClick={() => handleApprove(intern.id)}>
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleReject(intern.id)}>
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
