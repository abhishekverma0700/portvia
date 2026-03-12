import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Upload, FileEdit, Palette, Eye, Globe, Copy, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { hasResume, hasPortfolio, portfolio, togglePublish } = usePortfolio();
  const [copied, setCopied] = useState(false);

  const publicUrl = `${window.location.origin}/portfolio/${portfolio?.slug || 'your-name'}`;

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cards = [
    { icon: Upload, title: 'Upload Resume', desc: hasResume ? 'Resume uploaded ✓' : 'Upload your PDF or DOCX resume', to: '/dashboard/upload', done: hasResume },
    { icon: FileEdit, title: 'Edit Content', desc: 'Review and edit your portfolio data', to: '/dashboard/edit', done: hasResume },
    { icon: Palette, title: 'Choose Template', desc: hasPortfolio ? `Using: ${portfolio?.template_id}` : 'Pick a premium template', to: '/dashboard/templates', done: hasPortfolio },
    { icon: Eye, title: 'Preview Portfolio', desc: 'See how your portfolio looks', to: '/dashboard/preview', done: hasPortfolio },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Welcome back, <span className="gradient-text">{user?.full_name?.split(' ')[0] || 'there'}</span></h1>
        <p className="mt-1 text-muted-foreground">Manage your portfolio from here.</p>
      </motion.div>

      {/* Publish bar */}
      {hasPortfolio && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card neon-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{portfolio?.is_published ? 'Your portfolio is live!' : 'Your portfolio is not published'}</p>
              <p className="text-xs text-muted-foreground truncate max-w-xs">{publicUrl}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={copyLink} className="gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy Link'}
            </Button>
            <Button size="sm" onClick={togglePublish} className={portfolio?.is_published ? 'bg-destructive hover:bg-destructive/90' : 'btn-glow'}>
              {portfolio?.is_published ? 'Unpublish' : 'Publish'}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Link to={c.to} className="glass-card-hover flex items-start gap-4 p-5 group block">
              <div className={`rounded-lg p-2.5 ${c.done ? 'bg-primary/15' : 'bg-muted'}`}>
                <c.icon className={`h-5 w-5 ${c.done ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* AI CTA */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card border-accent/30 p-5 flex items-start gap-4">
        <div className="rounded-lg bg-accent/15 p-2.5">
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold">AI Content Improvement</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Use AI to rewrite your about section, project descriptions, and professional headline. Coming soon!</p>
        </div>
      </motion.div>
    </div>
  );
}
