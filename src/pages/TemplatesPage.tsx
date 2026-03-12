import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PortfolioTemplate } from '@/types/portfolio';

const templates: PortfolioTemplate[] = [
  { id: 'developer-neon', name: 'Developer Neon', description: 'Dark theme with glowing neon tech aesthetics. Perfect for developers.', preview_gradient: 'from-cyan-500 to-blue-600', tags: ['Dark', 'Futuristic', 'Tech'] },
  { id: 'glass-professional', name: 'Glass Professional', description: 'Sleek glassmorphism cards with modern layout. Great for students & teachers.', preview_gradient: 'from-violet-500 to-purple-600', tags: ['Glassmorphism', 'Modern', 'Clean'] },
  { id: 'minimal-elegant', name: 'Minimal Elegant', description: 'Clean, balanced spacing with a classy professional look.', preview_gradient: 'from-emerald-500 to-teal-600', tags: ['Minimal', 'Elegant', 'Simple'] },
];

export default function TemplatesPage() {
  const { portfolio, selectTemplate } = usePortfolio();
  const navigate = useNavigate();

  const handleSelect = (id: PortfolioTemplate['id']) => {
    selectTemplate(id);
    navigate('/dashboard/preview');
  };

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
              onClick={() => handleSelect(t.id)}
            >
              <div className={`h-40 bg-gradient-to-br ${t.preview_gradient} opacity-80 group-hover:opacity-100 transition-opacity relative`}>
                {selected && (
                  <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
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
                <Button size="sm" className={`mt-4 w-full ${selected ? 'btn-glow' : ''}`} variant={selected ? 'default' : 'outline'}>
                  {selected ? 'Selected' : 'Use Template'}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
