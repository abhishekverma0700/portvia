import { useParams } from 'react-router-dom';
import { usePortfolio } from '@/contexts/PortfolioContext';
import PortfolioRenderer from '@/components/portfolio/PortfolioRenderer';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PublicPortfolioPage() {
  const { slug } = useParams<{ slug: string }>();
  const { portfolio, resumeData } = usePortfolio();

  // In a real app this would fetch from DB by slug
  const isMatch = portfolio?.slug === slug;
  const isPublished = portfolio?.is_published;

  if (!isMatch || !isPublished) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Zap className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Portfolio Not Found</h1>
          <p className="text-muted-foreground">This portfolio doesn't exist or isn't published yet.</p>
          <Link to="/" className="text-primary hover:underline text-sm">← Back to Portvia</Link>
        </div>
      </div>
    );
  }

  return <PortfolioRenderer data={resumeData} templateId={portfolio.template_id} />;
}
