import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Zap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signup(email, password, fullName);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute left-1/3 top-1/3 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/3 h-[300px] w-[300px] rounded-full bg-accent/8 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="glass-card neon-border p-8">
          <div className="mb-6 flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Portvia</span>
          </div>

          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start building your portfolio today</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Alex Johnson" value={fullName} onChange={e => setFullName(e.target.value)} required className="mt-1.5 bg-muted/30 border-border/60" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1.5 bg-muted/30 border-border/60" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1.5 bg-muted/30 border-border/60" />
            </div>
            <Button type="submit" className="w-full btn-glow" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
