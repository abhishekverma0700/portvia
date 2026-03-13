import { ParsedResumeData } from '@/types/portfolio';
import { Mail, MapPin, Phone, ExternalLink, Github, Linkedin, Twitter } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = { GitHub: Github, LinkedIn: Linkedin, Twitter: Twitter };

export default function MinimalElegantTemplate({ data }: { data: ParsedResumeData }) {
  const email = data.email || data.contact.email;
  const phone = data.phone || data.contact.phone;
  const location = data.location || data.contact.location;

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#1a1a1a] font-sans">
      {/* Hero */}
      <section className="py-24 px-6 text-center border-b border-[#e8e6e1]">
        <h1 className="text-5xl font-bold tracking-tight text-[#111]">{data.full_name}</h1>
        <p className="mt-2 text-lg text-[#0d9488]">{data.professional_title}</p>
        <p className="mt-6 text-[#666] max-w-2xl mx-auto leading-relaxed">{data.about}</p>
        <div className="mt-6 flex justify-center gap-3">
          {data.social_links.map(s => {
            const Icon = iconMap[s.platform] || ExternalLink;
            return <a key={s.id} href={s.url} target="_blank" rel="noopener" className="p-2 rounded-lg border border-[#e8e6e1] hover:border-[#0d9488] text-[#888] hover:text-[#0d9488] transition-colors"><Icon className="h-5 w-5" /></a>;
          })}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">
        {/* Skills */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#0d9488] mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map(s => (
              <span key={s} className="px-3 py-1 rounded-full border border-[#e8e6e1] text-sm text-[#555]">{s}</span>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#0d9488] mb-4">Projects</h2>
          <div className="space-y-6">
            {data.projects.map(p => (
              <div key={p.id} className="border-l-2 border-[#0d9488] pl-5">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-sm text-[#666] mt-1">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.tech_stack.map(t => <span key={t} className="text-xs text-[#0d9488]">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#0d9488] mb-4">Experience</h2>
          <div className="space-y-6">
            {data.experience.map(e => (
              <div key={e.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold">{e.position} <span className="font-normal text-[#888]">at {e.company}</span></h3>
                  <span className="text-xs text-[#999]">{e.start_date} – {e.end_date}</span>
                </div>
                <p className="text-sm text-[#666] mt-1">{e.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#0d9488] mb-4">Education</h2>
          {data.education.map(e => (
            <div key={e.id}>
              <h3 className="font-semibold">{e.institution}</h3>
              <p className="text-sm text-[#666]">{e.degree} in {e.field} · {e.start_date}–{e.end_date}</p>
            </div>
          ))}
        </section>

        {!!data.certifications.length && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#0d9488] mb-4">Certifications</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-[#666]">
              {data.certifications.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        {!!data.achievements.length && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#0d9488] mb-4">Achievements</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-[#666]">
              {data.achievements.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        {/* Contact */}
        <section className="border-t border-[#e8e6e1] pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#0d9488] mb-4">Contact</h2>
          <div className="flex flex-wrap gap-6 text-sm text-[#666]">
            {email && <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#0d9488]" />{email}</span>}
            {phone && <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#0d9488]" />{phone}</span>}
            {location && <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#0d9488]" />{location}</span>}
          </div>
        </section>
      </div>
    </div>
  );
}
