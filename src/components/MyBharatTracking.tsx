import { useState, useEffect } from 'react';
import { User } from '@/lib/mockData';
import { saveData, loadData, KEYS } from '@/lib/persistence';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MyBharatState {
  regId: string;
  submitted: boolean;
}

interface MyBharatTrackingProps {
  user: User;
}

export function MyBharatTracking({ user }: MyBharatTrackingProps) {
  const [state, setState] = useState<MyBharatState>(() =>
    loadData<MyBharatState>(user.id, KEYS.MYBHARAT, { regId: '', submitted: false })
  );

  useEffect(() => {
    saveData(user.id, KEYS.MYBHARAT, state);
  }, [state, user.id]);

  const handleSubmit = () => {
    if (!state.regId.trim()) { toast.error('Enter your MyBharat Registration ID.'); return; }
    setState(prev => ({ ...prev, submitted: true }));
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
          {state.submitted ? (
            <Badge className="bg-warning/20 text-warning border-0">Pending Verification</Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              <XCircle className="h-3 w-3 mr-1" /> Not Registered
            </Badge>
          )}
        </div>
        {!state.submitted ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>MyBharat Registration ID</Label>
              <Input
                placeholder="e.g., MYBHARAT-2024-XXXXX"
                value={state.regId}
                onChange={e => setState(prev => ({ ...prev, regId: e.target.value }))}
              />
            </div>
            <Button onClick={handleSubmit} className="w-full">Submit for Verification</Button>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-muted/50 border text-sm">
            <p><span className="font-medium">Registration ID:</span> {state.regId}</p>
            <p className="text-muted-foreground mt-1">Awaiting admin approval.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
