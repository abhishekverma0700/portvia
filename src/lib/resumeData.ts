import { Json } from '@/integrations/supabase/types';
import { ParsedResumeData } from '@/types/portfolio';

const asString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => asString(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,\n|]/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
};

function normalizeProject(project: any) {
  return {
    id: asString(project?.id) || crypto.randomUUID(),
    title: asString(project?.title),
    description: asString(project?.description),
    tech_stack: toStringArray(project?.tech_stack),
    url: asString(project?.url),
  };
}

function normalizeExperience(exp: any) {
  return {
    id: asString(exp?.id) || crypto.randomUUID(),
    company: asString(exp?.company),
    position: asString(exp?.position),
    description: asString(exp?.description),
    start_date: asString(exp?.start_date),
    end_date: asString(exp?.end_date),
  };
}

function normalizeEducation(item: any) {
  return {
    id: asString(item?.id) || crypto.randomUUID(),
    institution: asString(item?.institution),
    degree: asString(item?.degree),
    field: asString(item?.field),
    start_date: asString(item?.start_date),
    end_date: asString(item?.end_date),
  };
}

function normalizeSocial(link: any) {
  const platform = asString(link?.platform) || 'Website';
  return {
    id: asString(link?.id) || crypto.randomUUID(),
    platform,
    url: asString(link?.url),
  };
}

export const EMPTY_RESUME_DATA: ParsedResumeData = {
  full_name: '',
  professional_title: '',
  about: '',
  summary: '',
  email: '',
  phone: '',
  location: '',
  skills: [],
  projects: [],
  education: [],
  experience: [],
  certifications: [],
  achievements: [],
  contact: { email: '', phone: '', location: '', website: '' },
  social_links: [],
};

export function normalizeResumeData(raw: unknown, fallback?: Partial<ParsedResumeData>): ParsedResumeData {
  const source = (raw && typeof raw === 'object' ? raw : {}) as any;
  const fallbackSource = (fallback || {}) as any;

  const contact = source.contact && typeof source.contact === 'object' ? source.contact : {};

  const email =
    asString(source.email) ||
    asString(contact.email) ||
    asString(fallbackSource.email) ||
    asString(fallbackSource.contact?.email);

  const phone =
    asString(source.phone) ||
    asString(contact.phone) ||
    asString(fallbackSource.phone) ||
    asString(fallbackSource.contact?.phone);

  const location =
    asString(source.location) ||
    asString(contact.location) ||
    asString(fallbackSource.location) ||
    asString(fallbackSource.contact?.location);

  const website =
    asString(contact.website) ||
    asString(fallbackSource.contact?.website);

  const summary = asString(source.summary) || asString(source.about);

  const normalized: ParsedResumeData = {
    ...EMPTY_RESUME_DATA,
    full_name: asString(source.full_name) || asString(fallbackSource.full_name),
    professional_title: asString(source.professional_title) || asString(fallbackSource.professional_title),
    about: asString(source.about) || asString(source.summary) || asString(fallbackSource.about),
    summary,
    email,
    phone,
    location,
    skills: toStringArray(source.skills),
    projects: Array.isArray(source.projects) ? source.projects.map(normalizeProject).filter((p: any) => p.title || p.description) : [],
    education: Array.isArray(source.education) ? source.education.map(normalizeEducation).filter((e: any) => e.institution || e.degree) : [],
    experience: Array.isArray(source.experience) ? source.experience.map(normalizeExperience).filter((e: any) => e.position || e.company || e.description) : [],
    certifications: toStringArray(source.certifications),
    achievements: toStringArray(source.achievements),
    contact: {
      email,
      phone,
      location,
      website,
    },
    social_links: Array.isArray(source.social_links) ? source.social_links.map(normalizeSocial).filter((s: any) => s.url) : [],
  };

  if (!normalized.about && normalized.summary) {
    normalized.about = normalized.summary;
  }

  if (!normalized.summary && normalized.about) {
    normalized.summary = normalized.about;
  }

  return normalized;
}

export function resumeDataToJson(data: ParsedResumeData): Json {
  return data as unknown as Json;
}

export function buildPortfolioSections(data: ParsedResumeData) {
  return [
    { section_type: 'basic_info', sort_order: 1, content_json: { full_name: data.full_name, professional_title: data.professional_title, about: data.about } as Json },
    { section_type: 'contact', sort_order: 2, content_json: { email: data.email, phone: data.phone, location: data.location, website: data.contact.website } as Json },
    { section_type: 'skills', sort_order: 3, content_json: data.skills as unknown as Json },
    { section_type: 'experience', sort_order: 4, content_json: data.experience as unknown as Json },
    { section_type: 'projects', sort_order: 5, content_json: data.projects as unknown as Json },
    { section_type: 'education', sort_order: 6, content_json: data.education as unknown as Json },
    { section_type: 'certifications', sort_order: 7, content_json: data.certifications as unknown as Json },
    { section_type: 'achievements', sort_order: 8, content_json: data.achievements as unknown as Json },
    { section_type: 'social_links', sort_order: 9, content_json: data.social_links as unknown as Json },
  ];
}
