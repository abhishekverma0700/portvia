import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import demoVideo from '@/assets/resumemasterconversion.mp4';

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      {/* Glow orbs */}
      <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[120px]" />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Portfolio Builder
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            Your Resume.{' '}
            <span className="gradient-text">Your Portfolio.</span>
            <br />
            Built Instantly.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Upload your resume and let Portvia transform it into a stunning, shareable portfolio website in seconds. No coding required.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="btn-glow gap-2 px-8 text-base">
              <Link to="/signup">
                Create My Portfolio
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 border-border/60 px-8 text-base backdrop-blur-sm">
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-20 max-w-4xl"
        >
          <div className="glass-card neon-border overflow-hidden rounded-xl p-1 shadow-2xl shadow-primary/10">
            {/* Browser chrome bar */}
            <div className="flex items-center gap-2 rounded-t-lg bg-muted/40 px-4 py-3 backdrop-blur-sm">
              <div className="h-3 w-3 rounded-full bg-destructive/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
              <div className="mx-4 flex-1 rounded-full bg-muted/60 px-3 py-1 text-left text-xs text-muted-foreground/60">
                portvia.app/portfolio/your-name
              </div>
            </div>
            {/* Video */}
            <video
              src={demoVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full rounded-b-lg object-cover"
              style={{ maxHeight: '480px' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
