import { useState } from 'react';
import yuvasevaLogo from '@/assets/yuvaseva-logo.png';
import vceLogo from '@/assets/vce-logo.png';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authenticateUser, DbProfile } from '@/lib/supabaseData';
import { toast } from 'sonner';

interface AuthProps {
  onLogin: (profile: DbProfile) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const profile = await authenticateUser(rollNumber, password);
      if (profile) {
        onLogin(profile);
        toast.success('Welcome');
        navigate('/dashboard');
      } else {
        toast.error('Invalid roll number or password');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-sm relative animate-fade-in shadow-elevated">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="flex items-center justify-center gap-3">
            <img src={vceLogo} alt="VCE" className="h-16 mx-auto object-contain" />
          </div>
          <p className="text-muted-foreground text-sm">Sign in to continue</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                type="text"
                placeholder="e.g. 24881A05AG"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={20}
                required
              />
            </div>
            <Button type="submit" className="w-full shadow-glow" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
