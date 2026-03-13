import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ParsedResumeData } from '@/types/portfolio';
import { Json } from '@/integrations/supabase/types';
import { extractTextFromResumeFile } from '@/services/resumeTextExtractor';
import { parseResumeText } from '@/services/resumeParser';
import { buildPortfolioSections, EMPTY_RESUME_DATA, normalizeResumeData, resumeDataToJson } from '@/lib/resumeData';

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

async function syncPortfolioSections(portfolioId: string, resumeData: ParsedResumeData) {
  const sections = buildPortfolioSections(resumeData);

  const { error: deleteError } = await supabase
    .from('portfolio_sections')
    .delete()
    .eq('portfolio_id', portfolioId);

  if (deleteError) {
    console.warn('[resume-debug] Failed to clear old portfolio_sections', deleteError);
  }

  const rows = sections.map(section => ({ ...section, portfolio_id: portfolioId }));
  const { error: insertError } = await supabase.from('portfolio_sections').insert(rows);

  if (insertError) {
    console.warn('[resume-debug] Failed to insert portfolio_sections', insertError);
  }
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [resume, setResume] = useState<ResumeRow | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioRow | null>(null);
  const [resumeData, setResumeDataState] = useState<ParsedResumeData>(EMPTY_RESUME_DATA);
  const [loading, setLoading] = useState(false);

  const setResumeData = useCallback((data: ParsedResumeData) => {
    setResumeDataState(normalizeResumeData(data));
  }, []);

  const refreshData = useCallback(async () => {
    if (!user) {
      setResume(null);
      setPortfolio(null);
      setResumeDataState(EMPTY_RESUME_DATA);
      return;
    }

    setLoading(true);
    try {
      const [{ data: resumes, error: resumeError }, { data: portfolios, error: portfolioError }] = await Promise.all([
        supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user.id)
          .order('uploaded_at', { ascending: false })
          .limit(1),
        supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1),
      ]);

      if (resumeError) throw resumeError;
      if (portfolioError) throw portfolioError;

      const latestResume = resumes?.[0] ?? null;
      const latestPortfolio = portfolios?.[0] ?? null;

      setResume(latestResume);
      setPortfolio(latestPortfolio);

      const fallbackData: Partial<ParsedResumeData> = {
        email: user.email || '',
        contact: { email: user.email || '' },
      };

      const sourceData = latestResume?.parsed_data_json || latestPortfolio?.data || null;
      const normalized = normalizeResumeData(sourceData, fallbackData);
      setResumeDataState(normalized);

      console.log('[resume-debug] Loaded edit/preview source', {
        resumeId: latestResume?.id,
        portfolioId: latestPortfolio?.id,
        normalized,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const uploadResume = async (file: File) => {
    if (!user) throw new Error('Not authenticated');

    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      throw new Error(uploadError.message || 'Resume upload failed.');
    }

    let extractedText = '';
    try {
      extractedText = await extractTextFromResumeFile(file);
      console.log('[resume-debug] Raw extracted text', extractedText.slice(0, 4000));
    } catch (error: any) {
      console.error('[resume-debug] Text extraction failed', error);
      throw new Error(error?.message || 'Could not extract text from resume file.');
    }

    const parsed = parseResumeText(extractedText);
    console.log('[resume-debug] Parsed structured JSON', parsed);

    const profile = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

    const normalized = normalizeResumeData(parsed, {
      full_name: profile.data?.full_name || '',
      email: profile.data?.email || user.email || '',
      contact: { email: profile.data?.email || user.email || '' },
    });

    const { data: resumeRow, error: insertError } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        file_url: filePath,
        original_filename: file.name,
        parsed_data_json: resumeDataToJson(normalized),
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message || 'Failed to save parsed resume data.');
    }

    console.log('[resume-debug] Saved resume row response', resumeRow);

    let updatedPortfolio = portfolio;
    if (portfolio) {
      const { data: syncedPortfolio, error: portfolioSyncError } = await supabase
        .from('portfolios')
        .update({ data: resumeDataToJson(normalized) })
        .eq('id', portfolio.id)
        .select()
        .single();

      if (portfolioSyncError) {
        console.warn('[resume-debug] Failed syncing portfolio data during upload', portfolioSyncError);
      } else if (syncedPortfolio) {
        updatedPortfolio = syncedPortfolio;
        await syncPortfolioSections(syncedPortfolio.id, normalized);
      }
    }

    setResume(resumeRow);
    setPortfolio(updatedPortfolio);
    setResumeDataState(normalized);
  };

  const selectTemplate = async (templateId: string) => {
    if (!user) throw new Error('Not authenticated');

    const currentData = normalizeResumeData(resumeData, {
      email: user.email || '',
      contact: { email: user.email || '' },
    });

    if (portfolio) {
      const { data: updated, error } = await supabase
        .from('portfolios')
        .update({ template_id: templateId, data: resumeDataToJson(currentData) })
        .eq('id', portfolio.id)
        .select()
        .single();

      if (error) throw error;
      setPortfolio(updated);
      await syncPortfolioSections(updated.id, currentData);
    } else {
      const profile = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      const name = profile.data?.full_name || currentData.full_name || 'My Portfolio';
      const slug = generateSlug(name);

      const { data: created, error } = await supabase
        .from('portfolios')
        .insert({
          user_id: user.id,
          title: `${name}'s Portfolio`,
          slug,
          template_id: templateId,
          data: resumeDataToJson(currentData),
        })
        .select()
        .single();

      if (error) throw error;
      setPortfolio(created);
      await syncPortfolioSections(created.id, currentData);
    }
  };

  const togglePublish = async () => {
    if (!portfolio) return;

    const normalized = normalizeResumeData(resumeData, {
      email: user?.email || '',
      contact: { email: user?.email || '' },
    });

    const { data: updated, error } = await supabase
      .from('portfolios')
      .update({ is_published: !portfolio.is_published, data: resumeDataToJson(normalized) })
      .eq('id', portfolio.id)
      .select()
      .single();

    if (error) throw error;
    setPortfolio(updated);
    setResumeDataState(normalized);
  };

  const savePortfolioData = async (data: ParsedResumeData) => {
    const normalized = normalizeResumeData(data, {
      email: user?.email || '',
      contact: { email: user?.email || '' },
    });

    setResumeDataState(normalized);

    if (resume) {
      const { data: updatedResume, error: resumeUpdateError } = await supabase
        .from('resumes')
        .update({ parsed_data_json: resumeDataToJson(normalized) })
        .eq('id', resume.id)
        .select()
        .single();

      if (resumeUpdateError) throw resumeUpdateError;
      setResume(updatedResume);
      console.log('[resume-debug] Saved resume parsed_data_json', updatedResume);
    }

    if (portfolio) {
      const { data: updatedPortfolio, error: portfolioUpdateError } = await supabase
        .from('portfolios')
        .update({ data: resumeDataToJson(normalized) })
        .eq('id', portfolio.id)
        .select()
        .single();

      if (portfolioUpdateError) throw portfolioUpdateError;

      setPortfolio(updatedPortfolio);
      await syncPortfolioSections(updatedPortfolio.id, normalized);
      console.log('[resume-debug] Saved portfolio data', updatedPortfolio);
    }
  };

  return (
    <PortfolioContext.Provider value={{
      resume,
      portfolio,
      resumeData,
      setResumeData,
      uploadResume,
      selectTemplate,
      togglePublish,
      savePortfolioData,
      hasResume: !!resume,
      hasPortfolio: !!portfolio,
      loading,
      refreshData,
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
