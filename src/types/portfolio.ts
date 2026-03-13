export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  username: string;
  avatar_url?: string;
  role: 'student' | 'teacher';
  created_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  file_url: string;
  original_filename: string;
  uploaded_at: string;
  parsed_data: ParsedResumeData | null;
}

export interface ParsedResumeData {
  full_name: string;
  professional_title: string;
  about: string;
  summary?: string;
  email?: string;
  phone?: string;
  location?: string;
  skills: string[];
  projects: ProjectItem[];
  education: EducationItem[];
  experience: ExperienceItem[];
  certifications: string[];
  achievements: string[];
  contact: ContactInfo;
  social_links: SocialLink[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  url?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  location?: string;
  website?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  template_id: 'developer-neon' | 'glass-professional' | 'minimal-elegant';
  is_published: boolean;
  theme_mode: 'dark' | 'light';
  created_at: string;
  updated_at: string;
  data: ParsedResumeData;
}

export interface PortfolioTemplate {
  id: 'developer-neon' | 'glass-professional' | 'minimal-elegant';
  name: string;
  description: string;
  preview_gradient: string;
  tags: string[];
}
