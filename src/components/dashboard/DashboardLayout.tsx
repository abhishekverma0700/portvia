import { Outlet, Link, useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Zap, Menu, X, LogOut, LayoutDashboard, Upload, FileEdit, Palette, Eye } from 'lucide-react';
import { useState } from 'react';

const mobileLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/upload', icon: Upload, label: 'Upload' },
  { to: '/dashboard/edit', icon: FileEdit, label: 'Edit' },
  { to: '/dashboard/templates', icon: Palette, label: 'Templates' },
  { to: '/dashboard/preview', icon: Eye, label: 'Preview' },
];

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold">Portvia</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {mobileOpen && (
          <div className="fixed inset-0 top-14 z-30 bg-background/95 backdrop-blur-xl p-4 lg:hidden">
            <nav className="space-y-1">
              {mobileLinks.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
