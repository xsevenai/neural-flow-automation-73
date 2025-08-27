import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import EnterpriseBar from "@/components/EnterpriseBar";
import ValuePropositions from "@/components/ValuePropositions";
import ArchitectureFlow from "@/components/ArchitectureFlow";
import VoiceChatDemo from "@/components/VoiceChatDemo";
import FinalCTA from "@/components/FinalCTA";

const Index = () => {
  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "X-SevenAI",
            "description": "AI-powered business automation platform for enterprise workflows",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web-based",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free trial available"
            },
            "provider": {
              "@type": "Organization",
              "name": "X-SevenAI",
              "description": "Enterprise AI automation platform"
            }
          })
        }}
      />
      
      <HeroSection />
      <EnterpriseBar />
      <ValuePropositions />
      <ArchitectureFlow />
      <VoiceChatDemo />
      <FinalCTA />
    </main>
  );
};

export default Index;
