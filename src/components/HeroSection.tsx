import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroOrbImage from "@/assets/neural-hero-orb.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Neural Orb */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: `url(${heroOrbImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background" />
      </div>
      
      {/* Floating Neural Nodes */}
      <div className="absolute inset-0 z-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full neural-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="neural-heading text-6xl md:text-8xl mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            The Future of Business
            <br />
            <span className="text-primary">Automation.</span> Today.
          </h1>
          
          <motion.p
            className="neural-body text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            X-SevenAI orchestrates workflows, automates decisions, and empowers 
            enterprises with autonomous intelligence.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button className="neural-btn-primary group" onClick={() => window.location.href = '/auth'}>
              Start Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" className="neural-btn-ghost group" onClick={() => window.location.href = '/auth'}>
              <Play className="mr-2 h-5 w-5" />
              Book Enterprise Demo
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Flow Line to Next Section */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flow-line" />
    </section>
  );
};

export default HeroSection;