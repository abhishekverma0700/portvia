import { useState, useEffect } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Plus, Trash2, Save, Upload, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ParsedResumeData } from '@/types/portfolio';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function EditPage() {
  const { resumeData, savePortfolioData, hasResume, loading } = usePortfolio();
  const [data, setData] = useState<ParsedResumeData>({ ...resumeData });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData({ ...resumeData });
    console.log('[resume-debug] Loaded edit page data', resumeData);
  }, [resumeData]);

  const update = (field: keyof ParsedResumeData, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await savePortfolioData(data);
      toast.success('Changes saved!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const aiImprove = (field: string) => {
    toast.info(`AI improvement for "${field}" coming soon!`);
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
        <h1 className="text-2xl font-bold">No Resume Yet</h1>
        <p className="text-muted-foreground">Upload your resume first to start editing your portfolio content.</p>
        <Button asChild className="btn-glow"><Link to="/dashboard/upload"><Upload className="mr-2 h-4 w-4" /> Upload Resume</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Portfolio Content</h1>
          <p className="mt-1 text-muted-foreground">Review and customize your portfolio data.</p>
        </div>
        <Button onClick={save} className="btn-glow gap-2" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
        </Button>
      </motion.div>

      {/* Basic info */}
      <Section title="Basic Info">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" value={data.full_name} onChange={v => update('full_name', v)} />
          <FieldWithAI label="Professional Title" value={data.professional_title} onChange={v => update('professional_title', v)} onAI={() => aiImprove('professional title')} />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <Label>About</Label>
            <Button size="sm" variant="ghost" onClick={() => aiImprove('about')} className="gap-1 text-xs text-accent"><Sparkles className="h-3 w-3" />AI Improve</Button>
          </div>
          <Textarea value={data.about} onChange={e => update('about', e.target.value)} rows={4} className="bg-muted/30 border-border/60" />
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm">
              {s}
              <button onClick={() => update('skills', data.skills.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
            </span>
          ))}
          <button
            onClick={() => {
              const skill = prompt('Add a skill:');
              if (skill) update('skills', [...data.skills, skill]);
            }}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
      </Section>

      {/* Projects */}
      <Section title="Projects">
        {data.projects.map((p, i) => (
          <div key={p.id} className="glass-card p-4 space-y-3 mb-3">
            <div className="flex justify-between">
              <Input value={p.title} onChange={e => { const ps = [...data.projects]; ps[i] = { ...p, title: e.target.value }; update('projects', ps); }} className="bg-transparent border-none font-semibold text-base p-0 h-auto" />
              <Button size="icon" variant="ghost" onClick={() => update('projects', data.projects.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
            </div>
            <Textarea value={p.description} onChange={e => { const ps = [...data.projects]; ps[i] = { ...p, description: e.target.value }; update('projects', ps); }} rows={2} className="bg-muted/30 border-border/60 text-sm" />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => update('projects', [...data.projects, { id: crypto.randomUUID(), title: '', description: '', tech_stack: [] }])} className="gap-1">
          <Plus className="h-3 w-3" /> Add Project
        </Button>
      </Section>

      {/* Experience */}
      <Section title="Experience">
        {data.experience.map((exp, i) => (
          <div key={exp.id} className="glass-card p-4 space-y-2 mb-3">
            <div className="flex justify-between items-start">
              <div>
                <Input value={exp.position} onChange={e => { const xs = [...data.experience]; xs[i] = { ...exp, position: e.target.value }; update('experience', xs); }} className="bg-transparent border-none font-semibold p-0 h-auto" placeholder="Position" />
                <Input value={exp.company} onChange={e => { const xs = [...data.experience]; xs[i] = { ...exp, company: e.target.value }; update('experience', xs); }} className="bg-transparent border-none text-sm text-muted-foreground p-0 h-auto mt-0.5" placeholder="Company" />
              </div>
              <Button size="icon" variant="ghost" onClick={() => update('experience', data.experience.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
            </div>
            <Textarea value={exp.description} onChange={e => { const xs = [...data.experience]; xs[i] = { ...exp, description: e.target.value }; update('experience', xs); }} rows={2} className="bg-muted/30 border-border/60 text-sm" />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => update('experience', [...data.experience, { id: crypto.randomUUID(), company: '', position: '', description: '', start_date: '', end_date: '' }])} className="gap-1">
          <Plus className="h-3 w-3" /> Add Experience
        </Button>
      </Section>

      {/* Education */}
      <Section title="Education">
        {data.education.map((ed, i) => (
          <div key={ed.id} className="glass-card p-4 mb-3">
            <div className="flex justify-between">
              <div className="grid gap-2 sm:grid-cols-2 flex-1">
                <Input value={ed.institution} onChange={e => { const es = [...data.education]; es[i] = { ...ed, institution: e.target.value }; update('education', es); }} placeholder="Institution" className="bg-muted/30 border-border/60" />
                <Input value={ed.degree} onChange={e => { const es = [...data.education]; es[i] = { ...ed, degree: e.target.value }; update('education', es); }} placeholder="Degree" className="bg-muted/30 border-border/60" />
              </div>
              <Button size="icon" variant="ghost" onClick={() => update('education', data.education.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => update('education', [...data.education, { id: crypto.randomUUID(), institution: '', degree: '', field: '', start_date: '', end_date: '' }])} className="gap-1">
          <Plus className="h-3 w-3" /> Add Education
        </Button>
      </Section>

      <Section title="Certifications">
        <div className="flex flex-wrap gap-2">
          {data.certifications.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm">
              {item}
              <button onClick={() => update('certifications', data.certifications.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
            </span>
          ))}
          <button
            onClick={() => {
              const cert = prompt('Add certification:');
              if (cert) update('certifications', [...data.certifications, cert]);
            }}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
      </Section>

      <Section title="Achievements">
        <div className="flex flex-wrap gap-2">
          {data.achievements.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm">
              {item}
              <button onClick={() => update('achievements', data.achievements.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
            </span>
          ))}
          <button
            onClick={() => {
              const achievement = prompt('Add achievement:');
              if (achievement) update('achievements', [...data.achievements, achievement]);
            }}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" value={data.email || data.contact.email || ''} onChange={v => { update('email', v); update('contact', { ...data.contact, email: v }); }} />
          <Field label="Phone" value={data.phone || data.contact.phone || ''} onChange={v => { update('phone', v); update('contact', { ...data.contact, phone: v }); }} />
          <Field label="Location" value={data.location || data.contact.location || ''} onChange={v => { update('location', v); update('contact', { ...data.contact, location: v }); }} />
          <Field label="Website" value={data.contact.website || ''} onChange={v => update('contact', { ...data.contact, website: v })} />
        </div>
      </Section>

      {/* Social */}
      <Section title="Social Links">
        {data.social_links.map((s, i) => (
          <div key={s.id} className="flex gap-2 mb-2">
            <Input value={s.platform} onChange={e => { const ss = [...data.social_links]; ss[i] = { ...s, platform: e.target.value }; update('social_links', ss); }} placeholder="Platform" className="bg-muted/30 border-border/60 w-32" />
            <Input value={s.url} onChange={e => { const ss = [...data.social_links]; ss[i] = { ...s, url: e.target.value }; update('social_links', ss); }} placeholder="URL" className="bg-muted/30 border-border/60 flex-1" />
            <Button size="icon" variant="ghost" onClick={() => update('social_links', data.social_links.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => update('social_links', [...data.social_links, { id: crypto.randomUUID(), platform: '', url: '' }])} className="gap-1">
          <Plus className="h-3 w-3" /> Add Link
        </Button>
      </Section>

      <div className="flex justify-end">
        <Button onClick={save} className="btn-glow gap-2" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <h2 className="text-lg font-semibold border-b border-border/50 pb-2">{title}</h2>
      {children}
    </motion.section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input value={value} onChange={e => onChange(e.target.value)} className="mt-1 bg-muted/30 border-border/60" />
    </div>
  );
}

function FieldWithAI({ label, value, onChange, onAI }: { label: string; value: string; onChange: (v: string) => void; onAI: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <Button size="sm" variant="ghost" onClick={onAI} className="gap-1 text-xs text-accent h-auto p-0"><Sparkles className="h-3 w-3" />AI</Button>
      </div>
      <Input value={value} onChange={e => onChange(e.target.value)} className="mt-1 bg-muted/30 border-border/60" />
    </div>
  );
}
