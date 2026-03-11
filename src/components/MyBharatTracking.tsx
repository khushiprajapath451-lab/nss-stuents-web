import { useState } from 'react';
import { User } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MyBharatTrackingProps {
  user: User;
}

export function MyBharatTracking({ user }: MyBharatTrackingProps) {
  const [regId, setRegId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!regId.trim()) { toast.error('Enter your MyBharat Registration ID.'); return; }
    setSubmitted(true);
    toast.success('MyBharat registration submitted for verification.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">MyBharat Registration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Register on MyBharat portal and submit your ID for verification.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Status:</span>
          {submitted ? (
            <Badge className="bg-warning/20 text-warning border-0">Pending Verification</Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              <XCircle className="h-3 w-3 mr-1" /> Not Registered
            </Badge>
          )}
        </div>
        {!submitted ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>MyBharat Registration ID</Label>
              <Input
                placeholder="e.g., MYBHARAT-2024-XXXXX"
                value={regId}
                onChange={e => setRegId(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmit} className="w-full">Submit for Verification</Button>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-muted/50 border text-sm">
            <p><span className="font-medium">Registration ID:</span> {regId}</p>
            <p className="text-muted-foreground mt-1">Awaiting admin approval.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
