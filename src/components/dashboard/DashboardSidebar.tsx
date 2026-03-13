import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Zap, LayoutDashboard, Upload, FileEdit, Palette, Eye, LogOut, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/upload', icon: Upload, label: 'Upload Resume' },
  { to: '/dashboard/edit', icon: FileEdit, label: 'Edit Resume' },
  { to: '/dashboard/templates', icon: Palette, label: 'Templates' },
  { to: '/dashboard/preview', icon: Eye, label: 'Preview' },
];

export default function DashboardSidebar() {
  const { logout, profile } = useAuth();
  const { portfolio } = usePortfolio();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const portfolioUrl = portfolio?.slug ? `/portfolio/${portfolio.slug}` : null;

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border/50 bg-sidebar h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border/50">
        <Zap className="h-5 w-5 text-primary" />
        <span className="font-bold text-lg">Portvia</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-primary font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
              )
            }
          >
            <l.icon className="h-4 w-4" />
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border/50 p-3 space-y-1">
        {portfolioUrl && portfolio?.is_published && (
          <NavLink
            to={portfolioUrl}
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View Public Portfolio
          </NavLink>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>

        {profile && (
          <div className="mt-3 px-3 py-2 text-xs text-muted-foreground truncate">
            {profile.email}
          </div>
        )}
      </div>
    </aside>
  );
}
