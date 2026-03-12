import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ParsedResumeData, Portfolio, Resume } from '@/types/portfolio';

const MOCK_PARSED_DATA: ParsedResumeData = {
  full_name: 'Alex Johnson',
  professional_title: 'Full Stack Developer & CS Student',
  about: 'Passionate computer science student with a love for building modern web applications. Experienced in React, Node.js, and cloud technologies. Always eager to learn new things and contribute to open-source projects.',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'PostgreSQL', 'Git', 'Docker', 'AWS', 'Figma'],
  projects: [
    { id: '1', title: 'EcoTrack', description: 'A sustainability tracking app that helps users monitor their carbon footprint with real-time data visualization.', tech_stack: ['React', 'D3.js', 'Node.js'], url: 'https://github.com/alex/ecotrack' },
    { id: '2', title: 'StudySync', description: 'Collaborative study platform with real-time note sharing, video calls, and AI-powered flashcard generation.', tech_stack: ['Next.js', 'WebRTC', 'OpenAI'], url: 'https://github.com/alex/studysync' },
    { id: '3', title: 'DevBoard', description: 'A customizable developer dashboard that aggregates GitHub activity, CI/CD status, and project metrics.', tech_stack: ['Vue.js', 'GraphQL', 'Docker'], url: '' },
  ],
  education: [
    { id: '1', institution: 'MIT', degree: 'Bachelor of Science', field: 'Computer Science', start_date: '2021', end_date: '2025' },
  ],
  experience: [
    { id: '1', company: 'Google', position: 'Software Engineering Intern', description: 'Developed internal tools for the Cloud Platform team, improving deployment workflow efficiency by 30%.', start_date: 'Jun 2024', end_date: 'Aug 2024' },
    { id: '2', company: 'StartupXYZ', position: 'Frontend Developer', description: 'Built responsive user interfaces and implemented design system components used across 5 product lines.', start_date: 'Jan 2023', end_date: 'May 2024' },
  ],
  contact: { email: 'alex@example.com', phone: '+1 (555) 123-4567', location: 'San Francisco, CA', website: 'https://alexjohnson.dev' },
  social_links: [
    { id: '1', platform: 'GitHub', url: 'https://github.com/alexjohnson' },
    { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com/in/alexjohnson' },
    { id: '3', platform: 'Twitter', url: 'https://twitter.com/alexjohnson' },
  ],
};

interface PortfolioContextType {
  resume: Resume | null;
  portfolio: Portfolio | null;
  resumeData: ParsedResumeData;
  setResumeData: (data: ParsedResumeData) => void;
  uploadResume: (file: File) => Promise<void>;
  selectTemplate: (templateId: Portfolio['template_id']) => void;
  togglePublish: () => void;
  hasResume: boolean;
  hasPortfolio: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [resumeData, setResumeData] = useState<ParsedResumeData>(MOCK_PARSED_DATA);

  useEffect(() => {
    const sr = localStorage.getItem('portvia_resume');
    const sp = localStorage.getItem('portvia_portfolio');
    if (sr) setResume(JSON.parse(sr));
    if (sp) setPortfolio(JSON.parse(sp));
  }, []);

  const uploadResume = async (file: File) => {
    await new Promise(r => setTimeout(r, 1500));
    const r: Resume = {
      id: crypto.randomUUID(),
      user_id: '1',
      file_url: URL.createObjectURL(file),
      original_filename: file.name,
      uploaded_at: new Date().toISOString(),
      parsed_data: MOCK_PARSED_DATA,
    };
    setResume(r);
    localStorage.setItem('portvia_resume', JSON.stringify(r));
  };

  const selectTemplate = (templateId: Portfolio['template_id']) => {
    const p: Portfolio = portfolio ? { ...portfolio, template_id: templateId, updated_at: new Date().toISOString() } : {
      id: crypto.randomUUID(),
      user_id: '1',
      title: `${resumeData.full_name}'s Portfolio`,
      slug: resumeData.full_name.toLowerCase().replace(/\s+/g, '-'),
      template_id: templateId,
      is_published: false,
      theme_mode: 'dark',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      data: resumeData,
    };
    setPortfolio(p);
    localStorage.setItem('portvia_portfolio', JSON.stringify(p));
  };

  const togglePublish = () => {
    if (!portfolio) return;
    const p = { ...portfolio, is_published: !portfolio.is_published, updated_at: new Date().toISOString() };
    setPortfolio(p);
    localStorage.setItem('portvia_portfolio', JSON.stringify(p));
  };

  return (
    <PortfolioContext.Provider value={{
      resume, portfolio, resumeData, setResumeData,
      uploadResume, selectTemplate, togglePublish,
      hasResume: !!resume, hasPortfolio: !!portfolio,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
