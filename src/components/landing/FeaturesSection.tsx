import { Upload, Palette, Globe, Sparkles, Shield, Zap } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

const features = [
  { icon: Upload,    title: 'Resume Upload',     description: 'Upload your PDF or DOCX resume and let AI extract your details automatically.',        color: 'from-cyan-500/20 to-blue-600/10',    glow: 'rgba(6,182,212,0.35)' },
  { icon: Palette,   title: 'Premium Templates', description: 'Choose from beautifully crafted templates designed for tech professionals.',              color: 'from-violet-500/20 to-purple-600/10', glow: 'rgba(139,92,246,0.35)' },
  { icon: Globe,     title: 'Public Portfolio',  description: 'Get a shareable public link to your portfolio that looks stunning on any device.',        color: 'from-pink-500/20 to-rose-600/10',     glow: 'rgba(236,72,153,0.35)' },
  { icon: Sparkles,  title: 'AI Enhancement',    description: 'Use AI to rewrite and improve your portfolio content for maximum impact.',               color: 'from-amber-500/20 to-orange-600/10',  glow: 'rgba(245,158,11,0.35)' },
  { icon: Shield,    title: 'Full Control',       description: 'Edit, update, publish, or unpublish your portfolio anytime from your dashboard.',        color: 'from-emerald-500/20 to-teal-600/10',  glow: 'rgba(16,185,129,0.35)' },
  { icon: Zap,       title: 'Instant Setup',      description: 'Go from resume upload to live portfolio in under 2 minutes. Zero coding needed.',        color: 'from-sky-500/20 to-indigo-600/10',    glow: 'rgba(99,102,241,0.35)' },
];

/* Individual 3-D tilt card */
function FeatureCard({ f, i }: { f: typeof features[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [14, -14]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-14, 14]), { stiffness: 300, damping: 30 });
  const glowX   = useSpring(useTransform(rawX, [-0.5, 0.5], [0, 100]),  { stiffness: 300, damping: 30 });
  const glowY   = useSpring(useTransform(rawY, [-0.5, 0.5], [0, 100]),  { stiffness: 300, damping: 30 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    rawX.set((e.clientX - left) / width - 0.5);
    rawY.set((e.clientY - top)  / height - 0.5);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.5 }}
      style={{ perspective: '900px' }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className={`glass-card-hover relative overflow-hidden p-6 bg-gradient-to-br ${f.color}`}
      >
        {/* Moving spotlight */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-gradient(circle at ${x}% ${y}%, ${f.glow} 0%, transparent 65%)`
            ),
            opacity: 1,
          }}
        />

        {/* Floating icon (pops out in Z) */}
        <div
          style={{ transform: 'translateZ(28px)' }}
          className="mb-4 inline-flex rounded-xl bg-primary/15 p-3 shadow-lg ring-1 ring-white/10 backdrop-blur-sm"
        >
          <f.icon className="h-6 w-6 text-primary" />
        </div>

        {/* Text content also slightly elevated */}
        <div style={{ transform: 'translateZ(16px)' }}>
          <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
          <p className="text-sm text-muted-foreground">{f.description}</p>
        </div>

        {/* Subtle bottom-edge shine line */}
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </motion.div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Everything You Need to <span className="gradient-text">Stand Out</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Portvia gives students and teachers the tools to create professional portfolios without any technical skills.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
