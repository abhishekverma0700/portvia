import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Check, Upload, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { PortfolioTemplate } from '@/types/portfolio';
import { toast } from 'sonner';
import { useState } from 'react';
import developerImg from '@/assets/devloper.jpg';
import glassImg from '@/assets/glass.jpg';
import elegantImg from '@/assets/elegant.jpg';

const templateImages: Record<string, string> = {
  'developer-neon': developerImg,
  'glass-professional': glassImg,
  'minimal-elegant': elegantImg,
};

const templates: PortfolioTemplate[] = [
  { id: 'developer-neon', name: 'Developer Neon', description: 'Dark theme with glowing neon tech aesthetics. Perfect for developers.', preview_gradient: 'from-cyan-500 to-blue-600', tags: ['Dark', 'Futuristic', 'Tech'] },
  { id: 'glass-professional', name: 'Glass Professional', description: 'Sleek glassmorphism cards with modern layout. Great for students & teachers.', preview_gradient: 'from-violet-500 to-purple-600', tags: ['Glassmorphism', 'Modern', 'Clean'] },
  { id: 'minimal-elegant', name: 'Minimal Elegant', description: 'Clean, balanced spacing with a classy professional look.', preview_gradient: 'from-emerald-500 to-teal-600', tags: ['Minimal', 'Elegant', 'Simple'] },
];

export default function TemplatesPage() {
  const { portfolio, selectTemplate, hasResume, loading } = usePortfolio();
  const navigate = useNavigate();
  const [selecting, setSelecting] = useState(false);

  const handleSelect = async (id: PortfolioTemplate['id']) => {
    setSelecting(true);
    try {
      await selectTemplate(id);
      toast.success('Template selected!');
      navigate('/dashboard/preview');
    } catch (err: any) {
      toast.error(err.message || 'Failed to select template');
    } finally {
      setSelecting(false);
    }
  };

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
        <h1 className="text-2xl font-bold">Upload Resume First</h1>
        <p className="text-muted-foreground">Upload your resume before selecting a template.</p>
        <Button asChild className="btn-glow"><Link to="/dashboard/upload"><Upload className="mr-2 h-4 w-4" /> Upload Resume</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Choose a Template</h1>
        <p className="mt-1 text-muted-foreground">Select a premium template for your portfolio.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {templates.map((t, i) => {
          const selected = portfolio?.template_id === t.id;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card overflow-hidden transition-all cursor-pointer group ${selected ? 'neon-border' : 'hover:border-primary/30'}`}
              onClick={() => !selecting && handleSelect(t.id)}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={templateImages[t.id]}
                  alt={`${t.name} preview`}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                {/* subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {selected && (
                  <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.tags.map(tag => (
                    <span key={tag} className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground">{tag}</span>
                  ))}
                </div>
                <Button size="sm" className={`mt-4 w-full ${selected ? 'btn-glow' : ''}`} variant={selected ? 'default' : 'outline'} disabled={selecting}>
                  {selecting ? <Loader2 className="h-4 w-4 animate-spin" /> : selected ? 'Selected' : 'Use Template'}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
