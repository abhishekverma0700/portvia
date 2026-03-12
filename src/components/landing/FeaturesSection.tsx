import { Upload, Palette, Globe, Sparkles, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Upload, title: 'Resume Upload', description: 'Upload your PDF or DOCX resume and let AI extract your details automatically.' },
  { icon: Palette, title: 'Premium Templates', description: 'Choose from beautifully crafted templates designed for tech professionals.' },
  { icon: Globe, title: 'Public Portfolio', description: 'Get a shareable public link to your portfolio that looks stunning on any device.' },
  { icon: Sparkles, title: 'AI Enhancement', description: 'Use AI to rewrite and improve your portfolio content for maximum impact.' },
  { icon: Shield, title: 'Full Control', description: 'Edit, update, publish, or unpublish your portfolio anytime from your dashboard.' },
  { icon: Zap, title: 'Instant Setup', description: 'Go from resume upload to live portfolio in under 2 minutes. Zero coding needed.' },
];

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
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
