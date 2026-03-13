import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ParsedResumeData } from '@/types/portfolio';
import PortfolioRenderer from '@/components/portfolio/PortfolioRenderer';
import { Zap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PublicPortfolioPage() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<ParsedResumeData | null>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      if (!slug) {
        setError('Portfolio not found');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (fetchError) {
        setError('Failed to load portfolio');
      } else if (!data) {
        setError('Portfolio not found or not published');
      } else {
        setPortfolioData(data.data as unknown as ParsedResumeData);
        setTemplateId(data.template_id);
      }
      setLoading(false);
    }
    fetchPortfolio();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !portfolioData || !templateId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Zap className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Portfolio Not Found</h1>
          <p className="text-muted-foreground">{error || "This portfolio doesn't exist or isn't published yet."}</p>
          <Link to="/" className="text-primary hover:underline text-sm">← Back to Portvia</Link>
        </div>
      </div>
    );
  }

  return <PortfolioRenderer data={portfolioData} templateId={templateId as any} />;
}
