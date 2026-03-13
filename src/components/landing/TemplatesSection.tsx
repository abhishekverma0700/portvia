import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import developerImg from '@/assets/devloper.jpg';
import glassImg from '@/assets/glass.jpg';
import elegantImg from '@/assets/elegant.jpg';

const templates = [
  { name: 'Developer Neon',    desc: 'Dark theme with glowing neon tech aesthetics.', image: developerImg, glow: 'rgba(6,182,212,0.4)',    tags: ['Dark', 'Futuristic', 'Tech'] },
  { name: 'Glass Professional',desc: 'Sleek glassmorphism cards, modern layout.',     image: glassImg,     glow: 'rgba(139,92,246,0.4)',   tags: ['Glassmorphism', 'Modern', 'Clean'] },
  { name: 'Minimal Elegant',   desc: 'Clean, balanced, and classy design.',           image: elegantImg,   glow: 'rgba(16,185,129,0.4)',   tags: ['Minimal', 'Elegant', 'Simple'] },
];

function TemplateCard({ t, i }: { t: typeof templates[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), { stiffness: 280, damping: 28 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), { stiffness: 280, damping: 28 });
  const glowX   = useSpring(useTransform(rawX, [-0.5, 0.5], [0, 100]),  { stiffness: 280, damping: 28 });
  const glowY   = useSpring(useTransform(rawY, [-0.5, 0.5], [0, 100]),  { stiffness: 280, damping: 28 });

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
      transition={{ delay: i * 0.15, duration: 0.5 }}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }}
        className="glass-card-hover group cursor-pointer overflow-hidden"
      >
        {/* Moving spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-xl"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, ${t.glow} 0%, transparent 60%)`
            ),
          }}
        />

        {/* Image */}
        <div className="relative h-48 overflow-hidden" style={{ transform: 'translateZ(0px)' }}>
          <img
            src={t.image}
            alt={`${t.name} preview`}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Text — floats slightly above the card surface */}
        <div className="relative z-10 p-6" style={{ transform: 'translateZ(20px)' }}>
          <h3 className="text-lg font-semibold">{t.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {t.tags.map(tag => (
              <span key={tag} className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">{tag}</span>
            ))}
          </div>
        </div>

        {/* Bottom shine */}
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </motion.div>
    </motion.div>
  );
}

export default function TemplatesSection() {
  return (
    <section id="templates" className="py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Premium <span className="gradient-text">Templates</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Three stunning designs to match your professional identity.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {templates.map((t, i) => (
            <TemplateCard key={t.name} t={t} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
