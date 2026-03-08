import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Mail, Lock, User } from 'lucide-react';
import { useEffect } from 'react';

interface AuthPanelProps {
  loading: boolean;
  error: string | null;
  onSignIn: (params: { email: string; password: string }) => Promise<void>;
  onSignUp: (params: { email: string; password: string; name?: string }) => Promise<void>;
}

export function AuthPanel({ loading, error, onSignIn, onSignUp }: AuthPanelProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Load saved credentials if they exist
    const savedEmail = localStorage.getItem('sc_saved_email');
    const savedPassword = localStorage.getItem('sc_saved_password');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      if (!email || !password) return;
      
      if (rememberMe) {
        localStorage.setItem('sc_saved_email', email);
        localStorage.setItem('sc_saved_password', password);
      } else {
        localStorage.removeItem('sc_saved_email');
        localStorage.removeItem('sc_saved_password');
      }

      await onSignIn({ email, password });
    } else {
      if (!email || !password) return;
      await onSignUp({ email, password, name });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--shadow-indigo)]/20 via-transparent to-[var(--shadow-violet)]/20 dark:from-[var(--glow-lavender)]/10 dark:via-transparent dark:to-[var(--glow-sky)]/10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      
      <Card className="w-full max-w-md relative z-10 border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl shadow-[var(--shadow-violet)]/30 dark:shadow-[var(--glow-violet)]/20 rounded-2xl overflow-hidden transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-[var(--accent-violet)] to-[var(--accent-cyan)]" />
        <CardHeader className="pb-4 pt-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-[var(--accent-violet)] rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 transform transition-transform hover:scale-105 duration-300">
            <span className="text-2xl font-bold text-white">SC</span>
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-[var(--accent-violet)] dark:from-[var(--accent-sky)] dark:to-[var(--accent-lavender)] bg-clip-text text-transparent">
            StudentCollab
          </CardTitle>
          <p className="text-sm text-center text-muted-foreground mt-2">
            Sign in or create an account to start collaborating
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as 'signin' | 'signup')}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-2 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative group">
                    <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 bg-background/50 border-input hover:border-border/80 focus:border-primary transition-all duration-300 shadow-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
                  </div>
                  <div className="relative group">
                    <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-background/50 border-input hover:border-border/80 focus:border-primary transition-all duration-300 shadow-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-border bg-background/50 accent-primary"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember" className="text-sm text-foreground cursor-pointer">
                    Remember me
                  </label>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center animate-in fade-in duration-300">
                    <span className="mr-2">⚠️</span> {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-[var(--accent-violet)] hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg shadow-primary/20"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative group">
                    <User className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                    <Input
                      type="text"
                      placeholder="Your name"
                      className="pl-10 bg-background/50 border-input hover:border-border/80 focus:border-primary transition-all duration-300 shadow-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative group">
                    <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 bg-background/50 border-input hover:border-border/80 focus:border-primary transition-all duration-300 shadow-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative group">
                    <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                    <Input
                      type="password"
                      placeholder="At least 6 characters"
                      className="pl-10 bg-background/50 border-input hover:border-border/80 focus:border-primary transition-all duration-300 shadow-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  After signing up, check your email to confirm your account.
                </p>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center animate-in fade-in duration-300">
                    <span className="mr-2">⚠️</span> {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg shadow-emerald-500/20 text-white"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

