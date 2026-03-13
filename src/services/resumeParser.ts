import { ParsedResumeData } from '@/types/portfolio';

const HEADING_MAP: Array<{ key: string; patterns: RegExp[] }> = [
  { key: 'summary', patterns: [/^summary$/i, /^about$/i, /^profile$/i, /^professional\s+summary$/i, /^objective$/i] },
  { key: 'skills', patterns: [/^skills?$/i, /^technical\s+skills?$/i, /^core\s+skills?$/i, /^technologies$/i] },
  { key: 'experience', patterns: [/^experience$/i, /^work\s+experience$/i, /^employment\s+history$/i, /^professional\s+experience$/i] },
  { key: 'projects', patterns: [/^projects?$/i, /^personal\s+projects?$/i, /^key\s+projects?$/i] },
  { key: 'education', patterns: [/^education$/i, /^academic\s+background$/i, /^qualifications?$/i] },
  { key: 'certifications', patterns: [/^certifications?$/i, /^licenses?$/i] },
  { key: 'achievements', patterns: [/^achievements?$/i, /^awards?$/i, /^accomplishments?$/i, /^highlights?$/i] },
  { key: 'contact', patterns: [/^contact$/i, /^contact\s+information$/i] },
];

function normalizeLine(line: string): string {
  return line
    .replace(/\u2022|\u25CF|\u25A0|\u25AA|\u2043/g, '-')
    .replace(/[\t\r]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter(Boolean);
}

function isHeading(line: string): string | null {
  const clean = line.replace(/[:\-]+$/, '').trim();
  const lower = clean.toLowerCase();

  for (const heading of HEADING_MAP) {
    if (heading.patterns.some(pattern => pattern.test(lower))) {
      return heading.key;
    }
  }

  return null;
}

function uniq(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const key = value.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(value.trim());
  }
  return out;
}

function pickName(lines: string[]): string {
  const candidate = lines.find(line => {
    if (line.length < 3 || line.length > 70) return false;
    if (isHeading(line)) return false;
    if (/[@\d]/.test(line)) return false;
    return /^[a-zA-Z][a-zA-Z .'-]+$/.test(line);
  });
  return candidate || '';
}

function pickTitle(lines: string[], fullName: string): string {
  const nameIndex = fullName ? lines.indexOf(fullName) : -1;
  if (nameIndex >= 0 && lines[nameIndex + 1] && !isHeading(lines[nameIndex + 1])) {
    const next = lines[nameIndex + 1];
    if (next.length <= 100 && !/[@]|\+\d/.test(next)) return next;
  }
  const fallback = lines.find(line => /(engineer|developer|designer|manager|analyst|consultant|architect|specialist)/i.test(line));
  return fallback || '';
}

function splitSectionLines(sectionText: string): string[] {
  return sectionText
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter(Boolean);
}

function parseDelimitedItems(text: string): string[] {
  return text
    .split(/[,|]/)
    .map(item => item.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
}

function parseSkills(text: string): string[] {
  const lines = splitSectionLines(text);
  if (!lines.length) return [];

  const parsed = lines.flatMap(line => {
    if (line.includes(',') || line.includes('|')) return parseDelimitedItems(line);
    return [line.replace(/^[-*]\s*/, '').trim()];
  });

  return uniq(parsed);
}

function parseSocialLinks(text: string): Array<{ platform: string; url: string }> {
  const links = text.match(/https?:\/\/[\w./?=#%&+\-_:]+/g) || [];
  return uniq(links).map(url => {
    let platform = 'Website';
    if (/linkedin/i.test(url)) platform = 'LinkedIn';
    else if (/github/i.test(url)) platform = 'GitHub';
    else if (/twitter|x\.com/i.test(url)) platform = 'Twitter';
    return { platform, url };
  });
}

function parseDateRange(line: string): { start_date: string; end_date: string } {
  const datePart = line.match(/((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\s*\d{4})\s*[-–]\s*((?:present|current|now|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\s*\d{4}))/i);
  if (!datePart) return { start_date: '', end_date: '' };
  return { start_date: datePart[1].trim(), end_date: datePart[2].trim() };
}

function parseExperience(text: string): ParsedResumeData['experience'] {
  const lines = splitSectionLines(text);
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (/^(?:-|\*)\s+/.test(line) && current.length) {
      blocks.push(current);
      current = [line.replace(/^(?:-|\*)\s+/, '')];
      continue;
    }

    if (!current.length) {
      current.push(line.replace(/^(?:-|\*)\s+/, ''));
    } else if (/\d{4}\s*[-–]\s*(?:\d{4}|present|current|now)/i.test(line) && current.length >= 2) {
      blocks.push(current);
      current = [line];
    } else {
      current.push(line);
    }
  }

  if (current.length) blocks.push(current);

  return blocks.slice(0, 10).map((block, index) => {
    const titleLine = block[0] || '';
    const companyLine = block[1] || '';
    const dateLine = block.find(line => /\d{4}\s*[-–]\s*(?:\d{4}|present|current|now)/i.test(line)) || '';
    const { start_date, end_date } = parseDateRange(dateLine);

    return {
      id: crypto.randomUUID(),
      position: titleLine.replace(/^[-*]\s*/, ''),
      company: companyLine,
      description: block.slice(2).join(' ').trim(),
      start_date,
      end_date,
    };
  }).filter(item => item.position || item.company || item.description);
}

function parseEducation(text: string): ParsedResumeData['education'] {
  const lines = splitSectionLines(text);
  const out: ParsedResumeData['education'] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line) continue;

    const next = lines[i + 1] || '';
    const combined = `${line} ${next}`;
    const { start_date, end_date } = parseDateRange(combined);

    out.push({
      id: crypto.randomUUID(),
      institution: line,
      degree: next,
      field: '',
      start_date,
      end_date,
    });

    i += 1;
  }

  return out.slice(0, 8);
}

function parseProjects(text: string): ParsedResumeData['projects'] {
  const lines = splitSectionLines(text);
  const entries: ParsedResumeData['projects'] = [];

  for (const line of lines) {
    const cleaned = line.replace(/^[-*]\s*/, '');
    const [titlePart, descPart] = cleaned.split(/[:\-]\s+/, 2);
    const title = (titlePart || '').trim();
    const description = (descPart || cleaned).trim();
    if (!title && !description) continue;

    entries.push({
      id: crypto.randomUUID(),
      title,
      description,
      tech_stack: uniq((description.match(/\b(react|node|typescript|javascript|python|java|aws|docker|kubernetes|sql|supabase|tailwind)\b/gi) || []).map(item => item)),
      url: (cleaned.match(/https?:\/\/[\w./?=#%&+\-_:]+/) || [])[0],
    });
  }

  return entries.slice(0, 10);
}

function parseAchievementsOrCerts(text: string): string[] {
  const lines = splitSectionLines(text);
  return uniq(lines.map(line => line.replace(/^[-*]\s*/, '').trim()));
}

function extractContact(text: string): { email: string; phone: string; location: string } {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)?.[0] || '';
  const phone = text.match(/(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)\d{3,4}[\s-]?\d{3,4}/)?.[0] || '';

  const locationCandidate = text
    .split(/\r?\n/)
    .map(normalizeLine)
    .find(line => /(india|usa|united states|uk|canada|australia|germany|france|city|state|remote|hybrid)/i.test(line) && line.length < 80);

  return {
    email,
    phone,
    location: locationCandidate || '',
  };
}

export function parseResumeText(rawText: string): Partial<ParsedResumeData> {
  const lines = splitLines(rawText);
  const sections: Record<string, string[]> = {};
  let currentSection = 'header';

  for (const line of lines) {
    const headingKey = isHeading(line);
    if (headingKey) {
      currentSection = headingKey;
      if (!sections[currentSection]) sections[currentSection] = [];
      continue;
    }

    if (!sections[currentSection]) sections[currentSection] = [];
    sections[currentSection].push(line);
  }

  const summaryText = (sections.summary || []).join('\n');
  const skillsText = (sections.skills || []).join('\n');
  const projectsText = (sections.projects || []).join('\n');
  const expText = (sections.experience || []).join('\n');
  const eduText = (sections.education || []).join('\n');
  const certsText = (sections.certifications || []).join('\n');
  const achievementsText = (sections.achievements || []).join('\n');
  const contactText = ((sections.contact || []).join('\n') || rawText);

  const full_name = pickName(lines);
  const professional_title = pickTitle(lines, full_name);
  const about = summaryText || (sections.header || []).slice(0, 3).join(' ');

  const contact = extractContact(contactText);
  const socialLinks = parseSocialLinks(rawText);

  return {
    full_name,
    professional_title,
    about,
    email: contact.email,
    phone: contact.phone,
    location: contact.location,
    skills: parseSkills(skillsText),
    projects: parseProjects(projectsText),
    experience: parseExperience(expText),
    education: parseEducation(eduText),
    certifications: parseAchievementsOrCerts(certsText),
    achievements: parseAchievementsOrCerts(achievementsText),
    social_links: socialLinks.map(link => ({ id: crypto.randomUUID(), ...link })),
    contact: {
      email: contact.email,
      phone: contact.phone,
      location: contact.location,
      website: socialLinks.find(link => link.platform === 'Website')?.url || '',
    },
  };
}
