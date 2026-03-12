import { ParsedResumeData } from '@/types/portfolio';
import { Mail, MapPin, Phone, ExternalLink, Github, Linkedin, Twitter } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = { GitHub: Github, LinkedIn: Linkedin, Twitter: Twitter };

export default function GlassProfessionalTemplate({ data }: { data: ParsedResumeData }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1035] via-[#0f0a2e] to-[#130d30] text-[#e8e0f4] font-sans">
      {/* Hero */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.12)_0%,_transparent_60%)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-3xl font-bold mb-6">
            {data.full_name.charAt(0)}
          </div>
          <h1 className="text-5xl font-extrabold">{data.full_name}</h1>
          <p className="mt-2 text-lg text-violet-300">{data.professional_title}</p>
          <p className="mt-6 text-[#a89ec4] max-w-2xl mx-auto leading-relaxed">{data.about}</p>
          <div className="mt-6 flex justify-center gap-3">
            {data.social_links.map(s => {
              const Icon = iconMap[s.platform] || ExternalLink;
              return <a key={s.id} href={s.url} target="_blank" rel="noopener" className="p-2.5 rounded-xl bg-[#ffffff08] backdrop-blur border border-[#ffffff12] hover:bg-[#ffffff15] transition-colors"><Icon className="h-5 w-5" /></a>;
            })}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-20 space-y-12">
        {/* Skills */}
        <section className="rounded-2xl bg-[#ffffff06] backdrop-blur-xl border border-[#ffffff10] p-6">
          <h2 className="text-xl font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map(s => (
              <span key={s} className="px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm text-violet-300">{s}</span>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-xl font-bold mb-4">Projects</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.projects.map(p => (
              <div key={p.id} className="rounded-2xl bg-[#ffffff06] backdrop-blur-xl border border-[#ffffff10] p-5 hover:bg-[#ffffff0a] transition-colors">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-sm text-[#a89ec4] mt-1">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tech_stack.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-xl font-bold mb-4">Experience</h2>
          <div className="space-y-4">
            {data.experience.map(e => (
              <div key={e.id} className="rounded-2xl bg-[#ffffff06] backdrop-blur-xl border border-[#ffffff10] p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{e.position}</h3>
                    <p className="text-sm text-violet-300">{e.company}</p>
                  </div>
                  <span className="text-xs text-[#8878aa] whitespace-nowrap">{e.start_date} – {e.end_date}</span>
                </div>
                <p className="text-sm text-[#a89ec4] mt-2">{e.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="rounded-2xl bg-[#ffffff06] backdrop-blur-xl border border-[#ffffff10] p-6">
          <h2 className="text-xl font-bold mb-4">Education</h2>
          {data.education.map(e => (
            <div key={e.id}>
              <h3 className="font-semibold">{e.institution}</h3>
              <p className="text-sm text-[#a89ec4]">{e.degree} in {e.field} · {e.start_date}–{e.end_date}</p>
            </div>
          ))}
        </section>

        {/* Contact */}
        <section className="rounded-2xl bg-[#ffffff06] backdrop-blur-xl border border-[#ffffff10] p-6">
          <h2 className="text-xl font-bold mb-4">Contact</h2>
          <div className="flex flex-wrap gap-4 text-sm text-[#a89ec4]">
            {data.contact.email && <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-violet-400" />{data.contact.email}</span>}
            {data.contact.phone && <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-violet-400" />{data.contact.phone}</span>}
            {data.contact.location && <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-violet-400" />{data.contact.location}</span>}
          </div>
        </section>
      </div>
    </div>
  );
}
