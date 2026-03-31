import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getInviterByCode, recordInviteJoin } from '@/lib/inviteData';
import {
  authenticateUser, fetchProfiles, fetchEventProposals,
  DbProfile, dbProfileToUser,
} from '@/lib/supabaseData';
import { toast } from 'sonner';
import { Users, Calendar, Award, ArrowRight } from 'lucide-react';
import yuvasevaLogo from '@/assets/yuvaseva-logo.png';

interface InviteLandingProps {
  onLogin: (profile: DbProfile) => void;
}

export default function InviteLanding({ onLogin }: InviteLandingProps) {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const inviter = code ? getInviterByCode(code) : null;

  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchProfiles().then(profiles => {
      const vols = profiles.filter(p => p.role === 'volunteer');
      setTotalVolunteers(vols.length);
      setTotalHours(vols.reduce((s, p) => s + Number(p.total_hours), 0));
    }).catch(() => {});
    fetchEventProposals().then(proposals => {
      setUpcomingEvents(proposals.filter(p => p.status === 'approved').slice(0, 3));
    }).catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const profile = await authenticateUser(rollNumber, password);
      if (profile) {
        if (code) recordInviteJoin(code, profile.id);
        onLogin(profile);
        toast.success(`Welcome, ${profile.name}!`);
        navigate('/dashboard');
      } else {
        toast.error('Invalid roll number or password');
      }
    } catch {
      toast.error('Login failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative py-12 space-y-8 max-w-2xl mx-auto">
        <div className="text-center space-y-4 animate-fade-in">
          <img src={yuvasevaLogo} alt="YuvaSeva" className="h-16 w-16 rounded-2xl mx-auto" />
          <h1 className="text-3xl font-bold font-display text-foreground">Campus Connect Hub</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            You were invited to join Campus Connect Hub to participate in community service and campus events.
          </p>
          {inviter && (
            <Badge variant="outline" className="text-sm">Invited by {inviter.name}</Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 animate-fade-in">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold font-display text-foreground">{totalVolunteers}</p>
              <p className="text-xs text-muted-foreground">Volunteers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <Award className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold font-display text-foreground">{totalHours}</p>
              <p className="text-xs text-muted-foreground">Service Hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold font-display text-foreground">{upcomingEvents.length}</p>
              <p className="text-xs text-muted-foreground">Upcoming Events</p>
            </CardContent>
          </Card>
        </div>

        {upcomingEvents.length > 0 && (
          <Card className="animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingEvents.map((evt: any) => (
                <div key={evt.id} className="flex items-center justify-between p-2 rounded-lg border text-sm">
                  <div>
                    <p className="font-medium">{evt.title}</p>
                    <p className="text-xs text-muted-foreground">{evt.proposed_date ? new Date(evt.proposed_date).toLocaleDateString() : ''}</p>
                  </div>
                  <Badge variant="outline" className="capitalize text-xs">{evt.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="shadow-elevated animate-fade-in">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">Join Now</CardTitle>
            <p className="text-sm text-muted-foreground">Sign in with your Roll Number</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input id="rollNumber" placeholder="e.g. 24881A05AG" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="6-character password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={6} required />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Join & Login'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
