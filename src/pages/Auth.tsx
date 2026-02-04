import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { users } from '@/lib/mockData';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn, UserPlus, Sparkles } from 'lucide-react';

interface AuthProps {
  onLogin: (user: typeof users[0]) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));

    const user = users.find((u) => u.email === email);

    if (user && password === 'nss123') {
      onLogin(user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password');
    }

    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.info('Signup is disabled in demo mode. Use seeded accounts.');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative animate-fade-in shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl hero-gradient shadow-glow">
            <span className="text-2xl font-bold text-primary-foreground">V</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-display">Vardhaman NSS Portal</CardTitle>
            <CardDescription>Sign in to track your volunteer journey</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@vardhaman.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full shadow-glow" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex items-center gap-2 text-sm font-medium mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Demo Accounts
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volunteer:</span>
                    <code className="text-xs bg-background px-2 py-0.5 rounded">khushi@vardhaman.edu</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NSS Head:</span>
                    <code className="text-xs bg-background px-2 py-0.5 rounded">head@vardhaman.edu</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Password:</span>
                    <code className="text-xs bg-background px-2 py-0.5 rounded">nss123</code>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" placeholder="Your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">College Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@vardhaman.edu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
