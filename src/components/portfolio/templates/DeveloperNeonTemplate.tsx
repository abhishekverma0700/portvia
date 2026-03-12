import { ParsedResumeData } from '@/types/portfolio';
import { Mail, MapPin, Phone, ExternalLink, Github, Linkedin, Twitter } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = { GitHub: Github, LinkedIn: Linkedin, Twitter: Twitter };

export default function DeveloperNeonTemplate({ data }: { data: ParsedResumeData }) {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e0e8f0] font-sans">
      {/* Hero */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,200,255,0.08)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            {data.full_name}
          </h1>
          <p className="mt-3 text-xl text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">
            {data.professional_title}
          </p>
          <p className="mt-6 text-[#8899aa] max-w-2xl mx-auto leading-relaxed">{data.about}</p>
          <div className="mt-6 flex justify-center gap-4">
            {data.social_links.map(s => {
              const Icon = iconMap[s.platform] || ExternalLink;
              return <a key={s.id} href={s.url} target="_blank" rel="noopener" className="p-2 rounded-lg border border-[#1a2640] hover:border-[#00d4ff]/40 transition-colors"><Icon className="h-5 w-5" /></a>;
            })}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-20 space-y-16">
        {/* Skills */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#00d4ff]">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map(s => (
              <span key={s} className="px-3 py-1.5 rounded-lg border border-[#00d4ff]/20 bg-[#00d4ff]/5 text-sm text-[#00d4ff]">{s}</span>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#00d4ff]">Projects</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.projects.map(p => (
              <div key={p.id} className="rounded-xl border border-[#1a2640] bg-[#0d1220] p-5 hover:border-[#00d4ff]/30 transition-colors">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-sm text-[#8899aa] mt-1">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tech_stack.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded bg-[#1a2640] text-[#66bbdd]">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#00d4ff]">Experience</h2>
          <div className="space-y-4">
            {data.experience.map(e => (
              <div key={e.id} className="rounded-xl border border-[#1a2640] bg-[#0d1220] p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{e.position}</h3>
                    <p className="text-sm text-[#00d4ff]">{e.company}</p>
                  </div>
                  <span className="text-xs text-[#667788] whitespace-nowrap">{e.start_date} – {e.end_date}</span>
                </div>
                <p className="text-sm text-[#8899aa] mt-2">{e.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#00d4ff]">Education</h2>
          {data.education.map(e => (
            <div key={e.id} className="rounded-xl border border-[#1a2640] bg-[#0d1220] p-5">
              <h3 className="font-semibold">{e.institution}</h3>
              <p className="text-sm text-[#8899aa]">{e.degree} in {e.field}</p>
              <p className="text-xs text-[#667788] mt-1">{e.start_date} – {e.end_date}</p>
            </div>
          ))}
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#00d4ff]">Contact</h2>
          <div className="flex flex-wrap gap-4 text-sm text-[#8899aa]">
            {data.contact.email && <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#00d4ff]" />{data.contact.email}</span>}
            {data.contact.phone && <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#00d4ff]" />{data.contact.phone}</span>}
            {data.contact.location && <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#00d4ff]" />{data.contact.location}</span>}
          </div>
        </section>
      </div>
    </div>
  );
}
