import { motion } from 'framer-motion';

const templates = [
  { name: 'Developer Neon', desc: 'Dark theme with glowing tech aesthetics.', gradient: 'from-cyan-500 to-blue-600', tags: ['Dark', 'Futuristic', 'Tech'] },
  { name: 'Glass Professional', desc: 'Sleek glassmorphism cards, modern layout.', gradient: 'from-violet-500 to-purple-600', tags: ['Glassmorphism', 'Modern', 'Clean'] },
  { name: 'Minimal Elegant', desc: 'Clean, balanced, and classy design.', gradient: 'from-emerald-500 to-teal-600', tags: ['Minimal', 'Elegant', 'Simple'] },
];

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
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card-hover group overflow-hidden"
            >
              <div className={`h-48 bg-gradient-to-br ${t.gradient} opacity-80 transition-opacity group-hover:opacity-100`} />
              <div className="p-6">
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {t.tags.map(tag => (
                    <span key={tag} className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
