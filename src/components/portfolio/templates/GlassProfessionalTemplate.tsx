import { ParsedResumeData } from '@/types/portfolio';
import { Mail, MapPin, Phone, ExternalLink, Github, Linkedin, Twitter, Sparkles } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = { GitHub: Github, LinkedIn: Linkedin, Twitter: Twitter };

export default function GlassProfessionalTemplate({ data }: { data: ParsedResumeData }) {
  const email = data.email || data.contact.email;
  const phone = data.phone || data.contact.phone;
  const location = data.location || data.contact.location;
  const initial = (data.full_name || 'P').charAt(0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1224] text-[#eff3ff]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.22),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(168,85,247,0.28),transparent_42%),radial-gradient(circle_at_50%_80%,rgba(45,212,191,0.18),transparent_40%)]" />
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-36 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6 lg:pt-24">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              Premium Glass
            </span>
            <h1 className="mt-4 text-balance text-4xl font-black leading-tight text-white sm:text-6xl">{data.full_name || 'Your Name'}</h1>
            <p className="mt-3 text-xl font-medium text-cyan-100 sm:text-2xl">{data.professional_title || 'Creative Professional'}</p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-100/90 sm:text-base">
              {data.about || 'A clean yet expressive portfolio blending design clarity, storytelling, and execution quality.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href="#projects" className="rounded-xl border border-cyan-200/50 bg-cyan-200/20 px-4 py-2 text-sm font-semibold text-cyan-50 transition-all hover:-translate-y-0.5 hover:bg-cyan-200/30">
                View Work
              </a>
              <a href="#contact" className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/20">
                Connect
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <article className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/80 to-violet-400/80 text-2xl font-bold text-[#121933]">
                  {initial}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Portfolio Profile</p>
                  <p className="mt-1 text-lg font-semibold text-white">{data.professional_title || 'Profile Ready'}</p>
                </div>
              </div>
            </article>
            <article className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Highlights</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/10 p-2 text-center">
                  <p className="text-lg font-bold text-cyan-100">{data.projects.length}</p>
                  <p className="text-[10px] uppercase tracking-wide text-slate-200">Projects</p>
                </div>
                <div className="rounded-xl bg-white/10 p-2 text-center">
                  <p className="text-lg font-bold text-cyan-100">{data.experience.length}</p>
                  <p className="text-[10px] uppercase tracking-wide text-slate-200">Experience</p>
                </div>
                <div className="rounded-xl bg-white/10 p-2 text-center">
                  <p className="text-lg font-bold text-cyan-100">{data.skills.length}</p>
                  <p className="text-[10px] uppercase tracking-wide text-slate-200">Skills</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8 px-4 pb-20 sm:px-6">
        <section className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">About</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-100/90 sm:text-lg">
            {data.summary || data.about || 'A modern, adaptable portfolio style with polished glass layers and elegant readability.'}
          </p>
        </section>

        <section className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Skills</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.skills.map(s => (
              <span key={s} className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium text-cyan-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20">{s}</span>
            ))}
          </div>
        </section>

        <section id="projects">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Projects</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.projects.map(p => (
              <article key={p.id} className="group rounded-3xl border border-white/20 bg-white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/15">
                <h3 className="text-xl font-semibold text-white">{p.title || 'Untitled Project'}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-100/90">{p.description || 'Project details coming soon.'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech_stack.map(t => <span key={t} className="rounded-full border border-cyan-200/40 bg-cyan-200/15 px-2.5 py-1 text-xs font-medium text-cyan-100">{t}</span>)}
                </div>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 hover:text-white">
                    Visit Project
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Experience</h2>
          <div className="space-y-4">
            {data.experience.map(e => (
              <article key={e.id} className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-0.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{e.position || 'Role'}</h3>
                    <p className="text-sm text-cyan-100">{e.company || 'Organization'}</p>
                  </div>
                  <span className="text-xs text-slate-200/80 whitespace-nowrap">{e.start_date} – {e.end_date}</span>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-100/90">{e.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Education</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {data.education.map(e => (
              <article key={e.id} className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <h3 className="font-semibold text-white">{e.institution || 'Institution'}</h3>
                <p className="mt-1 text-sm text-slate-100/90">{e.degree}{e.field ? ` in ${e.field}` : ''}</p>
                <p className="mt-2 text-xs text-slate-200/80">{e.start_date} – {e.end_date}</p>
              </article>
            ))}
          </div>
        </section>

        {!!data.certifications.length && (
          <section className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Certifications</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-slate-100/90">
              {data.certifications.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        {!!data.achievements.length && (
          <section className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Achievements</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-slate-100/90">
              {data.achievements.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        <section id="contact" className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Contact</h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-white">
            {email && <span className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-2"><Mail className="h-4 w-4 text-cyan-100" />{email}</span>}
            {phone && <span className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-2"><Phone className="h-4 w-4 text-cyan-100" />{phone}</span>}
            {location && <span className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-2"><MapPin className="h-4 w-4 text-cyan-100" />{location}</span>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.social_links.map(s => {
              const Icon = iconMap[s.platform] || ExternalLink;
              return <a key={s.id} href={s.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-lg border border-cyan-200/40 bg-cyan-200/15 px-3 py-2 text-xs font-medium text-cyan-50 transition-all hover:-translate-y-0.5 hover:bg-cyan-200/25"><Icon className="h-3.5 w-3.5" />{s.platform}</a>;
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
