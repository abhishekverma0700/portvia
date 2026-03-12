import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function FooterSection() {
  return (
    <>
      {/* CTA */}
      <section className="py-32">
        <div className="container text-center">
          <div className="glass-card neon-border mx-auto max-w-3xl p-12">
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready to Build Your <span className="gradient-text">Portfolio?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Join thousands of students and teachers showcasing their work with Portvia.
            </p>
            <Button size="lg" asChild className="btn-glow mt-8 px-8 text-base">
              <Link to="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold">Portvia</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Portvia. Built for students & teachers.
          </p>
        </div>
      </footer>
    </>
  );
}
