import { useEffect, useState } from 'react';
import {
  fetchProfiles, updateProfile, createNotification, DbProfile, POINTS,
} from '@/lib/supabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function MyBharatAdmin() {
  const [volunteers, setVolunteers] = useState<DbProfile[]>([]);
  const [verified, setVerified] = useState<Record<string, boolean>>({});

  const load = async () => {
    try {
      const profiles = await fetchProfiles();
      setVolunteers(profiles.filter(p => p.role === 'volunteer'));
    } catch { /* ignore */ }
  };
  useEffect(() => { load(); }, []);

  const handleVerify = async (v: DbProfile) => {
    try {
      await updateProfile(v.id, { reward_points: v.reward_points + POINTS.MYBHARAT_VERIFIED });
      await createNotification({
        type: 'reward', title: 'MyBharat Verified',
        message: `Your MyBharat registration was verified: +${POINTS.MYBHARAT_VERIFIED} points.`,
        user_id: v.id,
      });
      setVerified(prev => ({ ...prev, [v.id]: true }));
      toast.success(`${v.name}'s MyBharat registration verified (+${POINTS.MYBHARAT_VERIFIED} points).`);
      load();
    } catch { toast.error('Could not verify this registration.'); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">MyBharat Volunteers List</CardTitle>
        <p className="text-sm text-muted-foreground">
          Verifying awards {POINTS.MYBHARAT_VERIFIED} reward points automatically.
        </p>
      </CardHeader>
      <CardContent>
        {volunteers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No volunteers yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map(v => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-muted-foreground">{v.roll_number}</TableCell>
                  <TableCell>{v.branch}</TableCell>
                  <TableCell>{v.section}</TableCell>
                  <TableCell>
                    {verified[v.id] ? (
                      <Badge className="bg-success/20 text-success border-0">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        <XCircle className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={verified[v.id] ? 'outline' : 'default'}
                      disabled={verified[v.id]}
                      onClick={() => handleVerify(v)}
                    >
                      {verified[v.id] ? 'Verified' : 'Verify'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
