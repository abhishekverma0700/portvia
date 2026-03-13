import { ParsedResumeData } from '@/types/portfolio';
import { Mail, MapPin, Phone, ExternalLink, Github, Linkedin, Twitter, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = { GitHub: Github, LinkedIn: Linkedin, Twitter: Twitter };

export default function DeveloperNeonTemplate({ data }: { data: ParsedResumeData }) {
  const email = data.email || data.contact.email;
  const phone = data.phone || data.contact.phone;
  const location = data.location || data.contact.location;
  const shortName = data.full_name || 'Your Name';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050814] text-[#e8f3ff]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,245,255,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(88,102,255,0.20),transparent_38%),linear-gradient(180deg,#060913_0%,#050814_60%,#04060f_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(47,74,134,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(47,74,134,0.35)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-8 pt-16 sm:px-6 lg:pt-24">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200 shadow-[0_0_24px_rgba(0,212,255,0.25)]">
              Next-Gen Portfolio
            </span>
            <h1 className="text-balance text-4xl font-black uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl">
              {shortName}
            </h1>
            <p className="text-xl font-semibold tracking-wide text-cyan-300 sm:text-2xl">
              {data.professional_title || 'Futuristic Builder'}
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {data.about || 'I design and ship modern products with engineering precision, visual polish, and strong execution.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-xl border border-cyan-300/50 bg-cyan-300/15 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-300/25 hover:shadow-[0_0_30px_rgba(0,212,255,0.28)]"
              >
                Explore Projects
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center rounded-xl border border-slate-600/70 bg-slate-900/50 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/50"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-slate-900/65 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_28px_rgba(0,212,255,0.12)] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1 hover:rotate-[-0.4deg]">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-700/70 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Projects</p>
                <p className="mt-2 text-3xl font-bold text-cyan-200">{data.projects.length}</p>
              </div>
              <div className="rounded-xl border border-slate-700/70 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Experience</p>
                <p className="mt-2 text-3xl font-bold text-cyan-200">{data.experience.length}</p>
              </div>
              <div className="rounded-xl border border-slate-700/70 bg-slate-950/70 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Core Skills</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.skills.slice(0, 6).map(skill => (
                    <span key={skill} className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-xs font-medium text-cyan-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-6xl space-y-10 px-4 pb-20 sm:px-6 lg:space-y-12">
        <section className="rounded-2xl border border-cyan-300/20 bg-slate-900/65 p-6 shadow-[0_0_30px_rgba(0,212,255,0.12)] backdrop-blur-xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">About</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            {data.summary || data.about || 'Experienced professional focused on delivering high-impact solutions with clarity and speed.'}
          </p>
        </section>

        <section>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Skills Matrix</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.skills.map(skill => (
              <div
                key={skill}
                className="group rounded-xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-[0_8px_24px_rgba(0,212,255,0.18)]"
              >
                <p className="text-sm font-medium text-slate-100">{skill}</p>
                <div className="mt-2 h-1.5 rounded-full bg-slate-700">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 transition-all duration-500 group-hover:w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Projects</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.projects.map(p => (
              <article
                key={p.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/75 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.35),0_0_24px_rgba(0,212,255,0.2)]"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-300/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                <h3 className="text-xl font-semibold text-white">{p.title || 'Untitled Project'}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{p.description || 'Project description coming soon.'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech_stack.map(t => <span key={t} className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-xs font-medium text-cyan-100">{t}</span>)}
                </div>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-cyan-100">
                    Live Preview
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Experience</h2>
          <div className="space-y-4 border-l border-cyan-300/20 pl-5">
            {data.experience.map(e => (
              <article key={e.id} className="relative rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
                <span className="absolute -left-[1.55rem] top-6 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(0,212,255,0.7)]" />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{e.position || 'Role'}</h3>
                    <p className="text-sm text-cyan-300">{e.company || 'Company'}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{e.start_date} – {e.end_date}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 whitespace-pre-line">{e.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Education</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.education.map(e => (
              <article key={e.id} className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 transition-transform duration-300 hover:-translate-y-1">
                <h3 className="font-semibold text-white">{e.institution || 'Institution'}</h3>
                <p className="mt-2 text-sm text-slate-300">{e.degree}{e.field ? ` in ${e.field}` : ''}</p>
                <p className="mt-2 text-xs text-slate-400">{e.start_date} – {e.end_date}</p>
              </article>
            ))}
          </div>
        </section>

        {!!data.certifications.length && (
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Certifications</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-slate-300">
              {data.certifications.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        {!!data.achievements.length && (
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Achievements</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-slate-300">
              {data.achievements.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        <section id="contact" className="rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(0,212,255,0.12)]">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Contact</h2>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-200">
            {email && <span className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2"><Mail className="h-4 w-4 text-cyan-300" />{email}</span>}
            {phone && <span className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2"><Phone className="h-4 w-4 text-cyan-300" />{phone}</span>}
            {location && <span className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2"><MapPin className="h-4 w-4 text-cyan-300" />{location}</span>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.social_links.map(s => {
              const Icon = iconMap[s.platform] || ExternalLink;
              return <a key={s.id} href={s.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-100 transition-all hover:-translate-y-0.5 hover:bg-cyan-300/20"><Icon className="h-3.5 w-3.5" />{s.platform}</a>;
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
