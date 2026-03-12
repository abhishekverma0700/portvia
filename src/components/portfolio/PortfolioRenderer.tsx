import { ParsedResumeData } from '@/types/portfolio';
import DeveloperNeonTemplate from './templates/DeveloperNeonTemplate';
import GlassProfessionalTemplate from './templates/GlassProfessionalTemplate';
import MinimalElegantTemplate from './templates/MinimalElegantTemplate';

interface Props {
  data: ParsedResumeData;
  templateId: 'developer-neon' | 'glass-professional' | 'minimal-elegant';
}

export default function PortfolioRenderer({ data, templateId }: Props) {
  switch (templateId) {
    case 'developer-neon':
      return <DeveloperNeonTemplate data={data} />;
    case 'glass-professional':
      return <GlassProfessionalTemplate data={data} />;
    case 'minimal-elegant':
      return <MinimalElegantTemplate data={data} />;
    default:
      return <DeveloperNeonTemplate data={data} />;
  }
}
