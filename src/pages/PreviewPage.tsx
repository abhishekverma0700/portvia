import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Eye, Palette, Globe, Upload, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import PortfolioRenderer from '@/components/portfolio/PortfolioRenderer';

export default function PreviewPage() {
  const { portfolio, hasPortfolio, hasResume, resumeData, togglePublish, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasResume) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">No Resume Yet</h1>
        <p className="text-muted-foreground">Upload your resume to preview your portfolio.</p>
        <Button asChild className="btn-glow"><Link to="/dashboard/upload"><Upload className="mr-2 h-4 w-4" /> Upload Resume</Link></Button>
      </div>
    );
  }

  if (!hasPortfolio) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <Eye className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">No Portfolio Yet</h1>
        <p className="text-muted-foreground">Choose a template first to preview your portfolio.</p>
        <Button asChild className="btn-glow"><Link to="/dashboard/templates"><Palette className="mr-2 h-4 w-4" /> Choose Template</Link></Button>
      </div>
    );
  }

  const handleTogglePublish = async () => {
    try {
      await togglePublish();
      toast.success(portfolio?.is_published ? 'Portfolio unpublished' : 'Portfolio published!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Preview</h1>
          <p className="text-sm text-muted-foreground">Template: {portfolio?.template_id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard/templates"><Palette className="mr-2 h-4 w-4" /> Change</Link>
          </Button>
          <Button onClick={handleTogglePublish} className={portfolio?.is_published ? '' : 'btn-glow'}>
            <Globe className="mr-2 h-4 w-4" />
            {portfolio?.is_published ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </motion.div>

      <div className="glass-card neon-border overflow-hidden">
        <PortfolioRenderer data={resumeData} templateId={portfolio!.template_id as any} />
      </div>
    </div>
  );
}
