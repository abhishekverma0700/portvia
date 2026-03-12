import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TemplatesSection from '@/components/landing/TemplatesSection';
import FooterSection from '@/components/landing/FooterSection';

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <TemplatesSection />
    <FooterSection />
  </div>
);

export default Index;
