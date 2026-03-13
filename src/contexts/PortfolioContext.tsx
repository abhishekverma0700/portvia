import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ParsedResumeData } from '@/types/portfolio';
import { Json } from '@/integrations/supabase/types';

interface ResumeRow {
  id: string;
  user_id: string;
  file_url: string;
  original_filename: string;
  uploaded_at: string;
  parsed_data_json: Json | null;
}

interface PortfolioRow {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  template_id: string;
  is_published: boolean;
  theme_mode: string;
  created_at: string;
  updated_at: string;
  data: Json | null;
}

const EMPTY_RESUME_DATA: ParsedResumeData = {
  full_name: '',
  professional_title: '',
  about: '',
  skills: [],
  projects: [],
  education: [],
  experience: [],
  contact: { email: '' },
  social_links: [],
};

interface PortfolioContextType {
  resume: ResumeRow | null;
  portfolio: PortfolioRow | null;
  resumeData: ParsedResumeData;
  setResumeData: (data: ParsedResumeData) => void;
  uploadResume: (file: File) => Promise<void>;
  selectTemplate: (templateId: string) => Promise<void>;
  togglePublish: () => Promise<void>;
  savePortfolioData: (data: ParsedResumeData) => Promise<void>;
  hasResume: boolean;
  hasPortfolio: boolean;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

function generateSlug(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [resume, setResume] = useState<ResumeRow | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioRow | null>(null);
  const [resumeData, setResumeData] = useState<ParsedResumeData>(EMPTY_RESUME_DATA);
  const [loading, setLoading] = useState(false);

  const refreshData = useCallback(async () => {
    if (!user) {
      setResume(null);
      setPortfolio(null);
      setResumeData(EMPTY_RESUME_DATA);
      return;
    }
    setLoading(true);
    try {
      // Fetch latest resume
      const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false })
        .limit(1);
      
      const latestResume = resumes?.[0] ?? null;
      setResume(latestResume);

      // Fetch portfolio
      const { data: portfolios } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);
      
      const latestPortfolio = portfolios?.[0] ?? null;
      setPortfolio(latestPortfolio);

      // Set resumeData from portfolio data first, then resume parsed data
      if (latestPortfolio?.data) {
        setResumeData(latestPortfolio.data as unknown as ParsedResumeData);
      } else if (latestResume?.parsed_data_json) {
        setResumeData(latestResume.parsed_data_json as unknown as ParsedResumeData);
      } else {
        setResumeData(EMPTY_RESUME_DATA);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const uploadResume = async (file: File) => {
    if (!user) throw new Error('Not authenticated');

    // Upload to storage
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    // Get the file URL (private, use signed URL or just store path)
    const fileUrl = filePath;

    // Create mock parsed data from filename (real parsing would happen server-side)
    const profile = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    const parsedData: ParsedResumeData = {
      full_name: profile.data?.full_name || '',
      professional_title: '',
      about: '',
      skills: [],
      projects: [],
      education: [],
      experience: [],
      contact: { email: profile.data?.email || user.email || '' },
      social_links: [],
    };

    // Save resume record
    const { data: resumeRow, error: insertError } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        file_url: fileUrl,
        original_filename: file.name,
        parsed_data_json: parsedData as unknown as Json,
      })
      .select()
      .single();
    if (insertError) throw insertError;

    setResume(resumeRow);
    setResumeData(parsedData);
  };

  const selectTemplate = async (templateId: string) => {
    if (!user) throw new Error('Not authenticated');

    const currentData = resumeData;
    
    if (portfolio) {
      // Update existing portfolio
      const { data: updated, error } = await supabase
        .from('portfolios')
        .update({ template_id: templateId, data: currentData as unknown as Json })
        .eq('id', portfolio.id)
        .select()
        .single();
      if (error) throw error;
      setPortfolio(updated);
    } else {
      // Create new portfolio
      const profile = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      const name = profile.data?.full_name || 'My Portfolio';
      const slug = generateSlug(name);

      const { data: created, error } = await supabase
        .from('portfolios')
        .insert({
          user_id: user.id,
          title: `${name}'s Portfolio`,
          slug,
          template_id: templateId,
          data: currentData as unknown as Json,
        })
        .select()
        .single();
      if (error) throw error;
      setPortfolio(created);
    }
  };

  const togglePublish = async () => {
    if (!portfolio) return;
    const { data: updated, error } = await supabase
      .from('portfolios')
      .update({ is_published: !portfolio.is_published, data: resumeData as unknown as Json })
      .eq('id', portfolio.id)
      .select()
      .single();
    if (error) throw error;
    setPortfolio(updated);
  };

  const savePortfolioData = async (data: ParsedResumeData) => {
    setResumeData(data);
    
    // Save to resume parsed_data_json
    if (resume) {
      await supabase
        .from('resumes')
        .update({ parsed_data_json: data as unknown as Json })
        .eq('id', resume.id);
    }

    // Save to portfolio data
    if (portfolio) {
      const { data: updated } = await supabase
        .from('portfolios')
        .update({ data: data as unknown as Json })
        .eq('id', portfolio.id)
        .select()
        .single();
      if (updated) setPortfolio(updated);
    }
  };

  return (
    <PortfolioContext.Provider value={{
      resume, portfolio, resumeData, setResumeData,
      uploadResume, selectTemplate, togglePublish, savePortfolioData,
      hasResume: !!resume, hasPortfolio: !!portfolio, loading, refreshData,
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
