import { ParsedResumeData } from '@/types/portfolio';
import { Mail, MapPin, Phone, ExternalLink, Github, Linkedin, Twitter } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = { GitHub: Github, LinkedIn: Linkedin, Twitter: Twitter };

export default function MinimalElegantTemplate({ data }: { data: ParsedResumeData }) {
  const email = data.email || data.contact.email;
  const phone = data.phone || data.contact.phone;
  const location = data.location || data.contact.location;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f1ea] text-[#1f1b18]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(193,149,95,0.14),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(95,126,144,0.12),transparent_30%),linear-gradient(180deg,#f5f1ea_0%,#f1ece4_58%,#ece7de_100%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-8 hidden w-px bg-gradient-to-b from-transparent via-[#b89b7b]/45 to-transparent lg:block" />

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6 lg:pt-24">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="font-['Georgia','Times_New_Roman',serif] text-xs uppercase tracking-[0.22em] text-[#8e704f]">Curated Portfolio</p>
            <h1 className="mt-4 max-w-3xl font-['Georgia','Times_New_Roman',serif] text-4xl font-semibold leading-[1.02] text-[#15120f] sm:text-6xl">
              {data.full_name || 'Your Name'}
            </h1>
            <p className="mt-4 text-lg text-[#765d45] sm:text-xl">{data.professional_title || 'Professional Profile'}</p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#56483a]">
              {data.about || 'A refined portfolio with restrained design language, strong typography, and meaningful structure.'}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#projects" className="rounded-full border border-[#8e704f] bg-[#8e704f] px-5 py-2 text-sm font-semibold text-[#fffaf2] transition-all hover:-translate-y-0.5 hover:bg-[#7e6244]">
                Selected Work
              </a>
              <a href="#contact" className="rounded-full border border-[#c8b39b] bg-[#f9f5ef] px-5 py-2 text-sm font-semibold text-[#6a543d] transition-all hover:-translate-y-0.5 hover:border-[#8e704f]">
                Get in Touch
              </a>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[#d8c8b5] bg-[#fbf8f2]/85 p-6 shadow-[0_25px_60px_rgba(63,46,31,0.12)] backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8f7556]">Overview</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-[#e6d9ca] bg-[#f7f2ea] p-3 text-center">
                <p className="font-['Georgia','Times_New_Roman',serif] text-2xl font-semibold text-[#5d4a35]">{data.projects.length}</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#8f7556]">Projects</p>
              </div>
              <div className="rounded-2xl border border-[#e6d9ca] bg-[#f7f2ea] p-3 text-center">
                <p className="font-['Georgia','Times_New_Roman',serif] text-2xl font-semibold text-[#5d4a35]">{data.experience.length}</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#8f7556]">Roles</p>
              </div>
              <div className="rounded-2xl border border-[#e6d9ca] bg-[#f7f2ea] p-3 text-center">
                <p className="font-['Georgia','Times_New_Roman',serif] text-2xl font-semibold text-[#5d4a35]">{data.skills.length}</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#8f7556]">Skills</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.social_links.slice(0, 4).map(s => {
                const Icon = iconMap[s.platform] || ExternalLink;
                return <a key={s.id} href={s.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-[#d7c4ad] bg-[#fffaf2] px-3 py-1.5 text-xs font-medium text-[#6a543d] transition-all hover:-translate-y-0.5 hover:border-[#8e704f]"><Icon className="h-3.5 w-3.5" />{s.platform}</a>;
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-6xl space-y-10 px-4 pb-20 sm:px-6">
        <section className="grid gap-4 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-['Georgia','Times_New_Roman',serif] text-xl font-semibold text-[#2c2118]">About</h2>
          <article className="rounded-3xl border border-[#dccab6] bg-[#fcf8f2]/90 p-6 shadow-[0_16px_38px_rgba(63,46,31,0.1)]">
            <p className="text-base leading-relaxed text-[#56483a]">
              {data.summary || data.about || 'Purposeful portfolio design with an editorial rhythm and a high-end tone.'}
            </p>
          </article>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-['Georgia','Times_New_Roman',serif] text-xl font-semibold text-[#2c2118]">Skills</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.skills.map(s => (
              <div key={s} className="rounded-2xl border border-[#dccab6] bg-[#fbf7f0] px-4 py-3 text-sm font-medium text-[#4f4134] shadow-[0_10px_24px_rgba(63,46,31,0.08)] transition-all hover:-translate-y-0.5">
                {s}
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="grid gap-4 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-['Georgia','Times_New_Roman',serif] text-xl font-semibold text-[#2c2118]">Projects</h2>
          <div className="space-y-4">
            {data.projects.map(p => (
              <article key={p.id} className="rounded-3xl border border-[#dccab6] bg-[#fcf8f2]/90 p-5 shadow-[0_16px_38px_rgba(63,46,31,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(63,46,31,0.15)]">
                <h3 className="font-['Georgia','Times_New_Roman',serif] text-2xl font-semibold text-[#2f241a]">{p.title || 'Untitled Project'}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b4d3f]">{p.description || 'Project details coming soon.'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tech_stack.map(t => <span key={t} className="rounded-full border border-[#d7c4ad] bg-[#fffaf2] px-2.5 py-1 text-xs font-medium text-[#6a543d]">{t}</span>)}
                </div>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#7d6042] hover:text-[#5f472f]">
                    View Project
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-['Georgia','Times_New_Roman',serif] text-xl font-semibold text-[#2c2118]">Experience</h2>
          <div className="space-y-4">
            {data.experience.map(e => (
              <article key={e.id} className="rounded-3xl border border-[#dccab6] bg-[#fcf8f2]/90 p-5 shadow-[0_16px_38px_rgba(63,46,31,0.1)]">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="font-semibold text-[#2f241a]">{e.position || 'Role'} <span className="font-normal text-[#7d6a58]">at {e.company || 'Organization'}</span></h3>
                  <span className="text-xs text-[#8d7865]">{e.start_date} – {e.end_date}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#5b4d3f]">{e.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-['Georgia','Times_New_Roman',serif] text-xl font-semibold text-[#2c2118]">Education</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.education.map(e => (
              <article key={e.id} className="rounded-3xl border border-[#dccab6] bg-[#fcf8f2]/90 p-5 shadow-[0_16px_38px_rgba(63,46,31,0.1)]">
                <h3 className="font-semibold text-[#2f241a]">{e.institution || 'Institution'}</h3>
                <p className="mt-1 text-sm text-[#5b4d3f]">{e.degree}{e.field ? ` in ${e.field}` : ''}</p>
                <p className="mt-2 text-xs text-[#8d7865]">{e.start_date} – {e.end_date}</p>
              </article>
            ))}
          </div>
        </section>

        {!!data.certifications.length && (
          <section className="grid gap-4 lg:grid-cols-[1fr_2fr]">
            <h2 className="font-['Georgia','Times_New_Roman',serif] text-xl font-semibold text-[#2c2118]">Certifications</h2>
            <ul className="list-disc space-y-2 rounded-3xl border border-[#dccab6] bg-[#fcf8f2]/90 p-6 pl-10 text-sm text-[#5b4d3f] shadow-[0_16px_38px_rgba(63,46,31,0.1)]">
              {data.certifications.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        {!!data.achievements.length && (
          <section className="grid gap-4 lg:grid-cols-[1fr_2fr]">
            <h2 className="font-['Georgia','Times_New_Roman',serif] text-xl font-semibold text-[#2c2118]">Achievements</h2>
            <ul className="list-disc space-y-2 rounded-3xl border border-[#dccab6] bg-[#fcf8f2]/90 p-6 pl-10 text-sm text-[#5b4d3f] shadow-[0_16px_38px_rgba(63,46,31,0.1)]">
              {data.achievements.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        <section id="contact" className="grid gap-4 border-t border-[#d8c8b5] pt-8 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-['Georgia','Times_New_Roman',serif] text-xl font-semibold text-[#2c2118]">Contact</h2>
          <div>
            <div className="flex flex-wrap gap-3 text-sm text-[#4f4134]">
              {email && <span className="inline-flex items-center gap-2 rounded-full border border-[#d7c4ad] bg-[#fffaf2] px-3 py-2"><Mail className="h-4 w-4 text-[#8e704f]" />{email}</span>}
              {phone && <span className="inline-flex items-center gap-2 rounded-full border border-[#d7c4ad] bg-[#fffaf2] px-3 py-2"><Phone className="h-4 w-4 text-[#8e704f]" />{phone}</span>}
              {location && <span className="inline-flex items-center gap-2 rounded-full border border-[#d7c4ad] bg-[#fffaf2] px-3 py-2"><MapPin className="h-4 w-4 text-[#8e704f]" />{location}</span>}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.social_links.map(s => {
                const Icon = iconMap[s.platform] || ExternalLink;
                return <a key={s.id} href={s.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-[#cdb79d] bg-[#f8f1e7] px-3 py-2 text-xs font-semibold text-[#6a543d] transition-all hover:-translate-y-0.5 hover:border-[#8e704f]"><Icon className="h-3.5 w-3.5" />{s.platform}</a>;
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
