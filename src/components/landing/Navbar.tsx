import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">Portvia</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How It Works</a>
          <a href="#templates" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Templates</a>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button asChild className="btn-glow">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild className="btn-glow">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
