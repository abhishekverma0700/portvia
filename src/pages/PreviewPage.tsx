import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Eye, Palette, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import PortfolioRenderer from '@/components/portfolio/PortfolioRenderer';

export default function PreviewPage() {
  const { portfolio, hasPortfolio, resumeData, togglePublish } = usePortfolio();

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
          <Button onClick={togglePublish} className={portfolio?.is_published ? '' : 'btn-glow'}>
            <Globe className="mr-2 h-4 w-4" />
            {portfolio?.is_published ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </motion.div>

      <div className="glass-card neon-border overflow-hidden">
        <PortfolioRenderer data={resumeData} templateId={portfolio!.template_id} />
      </div>
    </div>
  );
}
