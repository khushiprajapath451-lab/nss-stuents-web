import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authenticateUser } from '@/lib/mockData';
import { toast } from 'sonner';

interface AuthProps {
  onLogin: (user: typeof import('@/lib/mockData').users[0]) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const user = authenticateUser(rollNumber, password);

    if (user) {
      onLogin(user);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/dashboard');
    } else {
      toast.error('Invalid roll number or password');
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl hero-gradient shadow-glow">
            <span className="text-2xl font-bold text-primary-foreground">NSS</span>
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
                placeholder="e.g. 24881A05Y3"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                className="uppercase"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="5-digit password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={5}
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
