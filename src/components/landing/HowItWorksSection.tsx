import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Upload Resume', desc: 'Drop your PDF or DOCX file and we extract all the details.' },
  { num: '02', title: 'Pick a Template', desc: 'Choose from 3 premium portfolio templates crafted for professionals.' },
  { num: '03', title: 'Edit & Enhance', desc: 'Review your data, tweak it, and use AI to improve your content.' },
  { num: '04', title: 'Publish & Share', desc: 'Hit publish and get a live shareable link to your portfolio.' },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-32">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            How <span className="gradient-text">Portvia</span> Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Four simple steps to your professional portfolio.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/5 font-mono text-2xl font-bold text-primary">
                {s.num}
              </div>
              <h3 className="mb-2 font-semibold text-lg">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
