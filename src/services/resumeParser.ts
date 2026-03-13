import { ParsedResumeData } from '@/types/portfolio';

const HEADING_MAP: Array<{ key: string; patterns: RegExp[] }> = [
  {
    key: 'summary',
    patterns: [
      /^summary$/i, /^about$/i, /^profile$/i,
      /^professional\s+summary$/i, /^career\s+summary$/i,
      /^objective$/i, /^career\s+objective$/i,
      /^about\s+me$/i, /^introduction$/i,
    ],
  },
  {
    key: 'skills',
    patterns: [
      /^skills?$/i, /^technical\s+skills?$/i, /^core\s+skills?$/i,
      /^technologies$/i, /^tools?\s*&?\s*technologies?$/i,
      /^programming\s+languages?$/i, /^skills?\s*&?\s*\w+/i,
      /^areas?\s+of\s+expertise$/i, /^competencies$/i,
    ],
  },
  {
    key: 'experience',
    patterns: [
      /^experience$/i, /^work\s+experience$/i, /^employment\s+history$/i,
      /^professional\s+experience$/i, /^work\s+history$/i,
      /^career\s+history$/i, /^internship(?:s)?$/i,
    ],
  },
  {
    key: 'projects',
    patterns: [
      /^projects?$/i, /^personal\s+projects?$/i, /^key\s+projects?$/i,
      /^notable\s+projects?$/i, /^academic\s+projects?$/i,
      /^side\s+projects?$/i,
    ],
  },
  {
    key: 'education',
    patterns: [
      /^education$/i, /^academic\s+background$/i, /^qualifications?$/i,
      /^educational\s+background$/i, /^academic\s+qualifications?$/i,
    ],
  },
  {
    key: 'certifications',
    patterns: [
      /^certifications?$/i, /^licenses?\s*&?\s*certifications?$/i,
      /^courses?\s*&?\s*certifications?$/i, /^professional\s+certifications?$/i,
    ],
  },
  {
    key: 'achievements',
    patterns: [
      /^achievements?$/i, /^awards?$/i, /^accomplishments?$/i,
      /^highlights?$/i, /^honors?\s*&?\s*awards?$/i,
      /^recognitions?$/i,
    ],
  },
  {
    key: 'contact',
    patterns: [
      /^contact$/i, /^contact\s+information$/i, /^contact\s+details?$/i,
      /^personal\s+information$/i,
    ],
  },
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
  // Only look in the first 15 lines so we don't pick up summary sentences
  const candidates = lines.slice(0, 15);
  const fallback = candidates.find(
    line =>
      /(engineer|developer|designer|manager|analyst|consultant|architect|specialist|intern|student)/i.test(
        line,
      ) &&
      line.length <= 80 &&
      !isHeading(line) &&
      line !== fullName,
  );
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
    // Strip leading category labels like "Languages:", "Frameworks:", "Tools & Platforms:"
    const withoutLabel = line.replace(/^[A-Za-z][A-Za-z\s&/]{1,30}:\s*/, '');
    const cleaned = (withoutLabel || line).replace(/^[-*•]\s*/, '').trim();
    if (!cleaned) return [];
    if (cleaned.includes(',') || cleaned.includes('|')) return parseDelimitedItems(cleaned);
    return [cleaned];
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
  if (!lines.length) return [];

  const bulletRe = /^[-*•]\s+/;
  const dateRe = /\d{4}\s*[-–—]\s*(?:\d{4}|present|current|now)/i;

  // A new experience block starts when a non-bullet, non-date line appears
  // AFTER the current block already has at least one bullet line. This reliably
  // separates "header + bullets" groups without mis-splitting mid-entry.
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    const isBullet = bulletRe.test(line);

    if (!current.length) {
      current.push(line);
    } else if (!isBullet && current.some(l => bulletRe.test(l))) {
      // Non-bullet after bullets → new entry starts
      blocks.push(current);
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length) blocks.push(current);

  return blocks
    .slice(0, 10)
    .map(block => {
      const nonBullets = block.filter(l => !bulletRe.test(l));
      const bullets = block.filter(l => bulletRe.test(l));

      // Find a date line within the non-bullet lines
      const dateLine = nonBullets.find(l => dateRe.test(l)) || '';
      const { start_date, end_date } = parseDateRange(dateLine);

      // Header lines are non-bullet, non-date lines
      const headerLines = nonBullets
        .filter(l => l !== dateLine && !dateRe.test(l))
        .map(l => l.replace(/^[-*•]\s*/, '').trim())
        .filter(Boolean);

      let position = headerLines[0] || '';
      let company = headerLines[1] || '';

      // Handle inline "Position | Company" or "Position @ Company" formats
      if (!company && (position.includes(' | ') || / @ /i.test(position))) {
        const sep = position.includes(' | ') ? ' | ' : / @ /i.exec(position)![0];
        const parts = position.split(sep);
        position = parts[0].trim();
        company = parts.slice(1).join(' ').trim();
      }

      // Strip any date fragments that leaked into position/company text
      position = position.replace(/\s+\d{4}\s*[-–—].*$/i, '').trim();
      company = company.replace(/\s+\d{4}\s*[-–—].*$/i, '').split(/[·,]/)[0].trim();

      const description = bullets
        .map(l => l.replace(/^[-*•]\s*/, '').trim())
        .join('\n');

      return {
        id: crypto.randomUUID(),
        position,
        company,
        description,
        start_date,
        end_date,
      };
    })
    .filter(item => item.position || item.company || item.description);
}

// Degree keywords used to detect new education entries and distinguish degree from institution
const DEGREE_RE =
  /\b(?:b\.?tech|b\.?e\.?|b\.?sc?\.?|b\.?a\.?|m\.?tech|m\.?sc?\.?|m\.?e\.?|m\.?a\.?|mba|ph\.?d|bachelor|master|diploma|associate|b\.?eng|m\.?eng|high\s+school|secondary|10th|12th|ssc|hsc|intermediate)\b/i;

function parseEducation(text: string): ParsedResumeData['education'] {
  const lines = splitSectionLines(text);
  if (!lines.length) return [];

  const dateRe = /\d{4}\s*[-–—]\s*(?:\d{4}|present|current|now)/i;

  // Start a new block each time we encounter a degree-keyword line (after the first)
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (DEGREE_RE.test(line) && current.length > 0 && !current.some(l => DEGREE_RE.test(l))) {
      // First degree line in current block
      current.push(line);
    } else if (DEGREE_RE.test(line) && current.some(l => DEGREE_RE.test(l))) {
      // Second degree line → start new block
      blocks.push(current);
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length) blocks.push(current);

  return blocks
    .slice(0, 8)
    .map(block => {
      const combined = block.join(' ');
      const { start_date, end_date } = parseDateRange(combined);

      const degreeLine = block.find(l => DEGREE_RE.test(l)) || '';
      const institutionLine =
        block.find(l => l !== degreeLine && !dateRe.test(l)) || degreeLine;

      // Extract "in <field>" from degree line
      let degree = degreeLine.replace(/\d{4}.*$/i, '').trim();
      let field = '';
      const fieldMatch = degree.match(/\bin\s+([^,\n\d]{2,40})/i);
      if (fieldMatch) {
        field = fieldMatch[1].trim();
        degree = degree.replace(/\s+in\s+[^,\n\d]{2,40}/i, '').trim();
      }

      const institution = institutionLine
        .replace(/\s*[,·|]\s*\d.*$/i, '')
        .replace(/\d{4}.*$/i, '')
        .trim();

      return {
        id: crypto.randomUUID(),
        institution,
        degree,
        field,
        start_date,
        end_date,
      };
    })
    .filter(item => item.institution || item.degree);
}

const TECH_PATTERN =
  /\b(react|next\.?js|vue|angular|typescript|javascript|python|java|go|rust|ruby|php|swift|kotlin|c\+\+|node|express|django|fastapi|spring|flutter|dart|aws|gcp|azure|docker|kubernetes|postgres|mysql|mongodb|redis|supabase|tailwind|graphql|rest|firebase)\b/gi;

function parseProjects(text: string): ParsedResumeData['projects'] {
  const lines = splitSectionLines(text);
  if (!lines.length) return [];

  const bulletRe = /^[-*•]\s+/;
  const urlRe = /https?:\/\/[\w./?=#%&+\-_:]+/;

  // Group lines into blocks the same way as experience:
  // a new block begins when a non-bullet line appears after bullet lines.
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    const isBullet = bulletRe.test(line);

    if (!current.length) {
      current.push(line);
    } else if (!isBullet && current.some(l => bulletRe.test(l))) {
      blocks.push(current);
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length) blocks.push(current);

  // If no multi-line blocks were detected (single-line project entries),
  // fall back to treating each line as a standalone project.
  if (blocks.every(b => b.length === 1)) {
    return lines.slice(0, 10).flatMap(line => {
      const cleaned = line.replace(/^[-*•]\s*/, '');
      if (!cleaned) return [];
      const colonIdx = cleaned.indexOf(':');
      const title =
        colonIdx > 0 && colonIdx < 50 ? cleaned.slice(0, colonIdx).trim() : cleaned.slice(0, 60).trim();
      const desc =
        colonIdx > 0 && colonIdx < 50 ? cleaned.slice(colonIdx + 1).trim() : cleaned;
      return [
        {
          id: crypto.randomUUID(),
          title,
          description: desc,
          tech_stack: uniq(Array.from(desc.matchAll(TECH_PATTERN), m => m[0])),
          url: (cleaned.match(urlRe) || [])[0],
        },
      ];
    });
  }

  return blocks
    .slice(0, 10)
    .map(block => {
      const nonBullets = block.filter(l => !bulletRe.test(l));
      const bullets = block.filter(l => bulletRe.test(l));

      const title = (nonBullets[0] || '').replace(/^[-*•]\s*/, '').replace(urlRe, '').trim();
      const descBullets = bullets.map(l => l.replace(/^[-*•]\s*/, '').trim()).join(' ');
      const descRest = nonBullets.slice(1).join(' ');
      const description = (descBullets || descRest).trim();
      const fullText = block.join(' ');

      return {
        id: crypto.randomUUID(),
        title,
        description,
        tech_stack: uniq(Array.from(fullText.matchAll(TECH_PATTERN), m => m[0])),
        url: (fullText.match(urlRe) || [])[0],
      };
    })
    .filter(p => p.title || p.description);
}

function parseAchievementsOrCerts(text: string): string[] {
  const lines = splitSectionLines(text);
  return uniq(lines.map(line => line.replace(/^[-*]\s*/, '').trim()));
}

function extractContact(text: string): { email: string; phone: string; location: string } {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)?.[0] || '';

  // Match common phone formats: +91-9876543210, (555) 123-4567, +1 800 555 0100, etc.
  const phoneMatch = text.match(
    /(?:\+\d{1,3}[\s\-.]?)?\(?\d{3,5}\)?[\s\-.]?\d{3,5}[\s\-.]?\d{3,5}/,
  );
  let phone = '';
  if (phoneMatch) {
    const candidate = phoneMatch[0].replace(/[^\d+\-() .]/g, '').trim();
    // Only keep if it looks like a real phone number (≥10 digits)
    if (candidate.replace(/\D/g, '').length >= 10) phone = candidate;
  }

  // Location: prefer "City, State/Country" pattern; fall back to known keywords.
  const LOCATION_KW =
    /\b(india|usa|united\s+states?|uk|united\s+kingdom|canada|australia|germany|france|remote|hybrid|bengaluru|bangalore|mumbai|delhi|new\s+delhi|hyderabad|chennai|pune|kolkata|ahmedabad|jaipur|new\s+york|san\s+francisco|los\s+angeles|london|toronto|singapore|dubai|berlin|seattle|austin|chicago|boston|sydney|melbourne)\b/i;

  const lines = text.split(/\r?\n/).map(normalizeLine).filter(Boolean);
  let location = '';

  for (const line of lines) {
    if (line.length > 100 || /[@]/.test(line)) continue;

    // "City, State" or "City, Country" — avoid matching company/institution names
    const cityStateMatch = line.match(/\b([A-Z][a-zA-Z]{1,20}),\s*([A-Z][a-zA-Z\s]{1,20})\b/);
    if (
      cityStateMatch &&
      !/\b(university|college|school|institute|inc|ltd|llc|corp|pvt|technologies|solutions)\b/i.test(
        cityStateMatch[0],
      )
    ) {
      location = cityStateMatch[0].trim();
      break;
    }

    // Known location keyword
    const kwMatch = line.match(LOCATION_KW);
    if (kwMatch) {
      // Use the whole line segment up to any separator, but cap at 50 chars
      const segment = line.split(/[|·•,]/)[0].trim();
      location = segment.length <= 50 ? segment : kwMatch[0].trim();
      break;
    }
  }

  return { email, phone, location };
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
