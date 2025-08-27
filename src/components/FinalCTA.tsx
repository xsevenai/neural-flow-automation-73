import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        {/* Neural Network Grid */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="neural-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="0.5" fill="currentColor" className="text-primary" />
                <line x1="5" y1="5" x2="15" y2="5" stroke="currentColor" strokeWidth="0.1" className="text-primary" />
                <line x1="5" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="0.1" className="text-primary" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural-grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="neural-heading text-6xl md:text-8xl mb-8">
            Automate. <span className="text-primary">Orchestrate.</span>
            <br />
            Lead the <span className="text-accent">Future.</span>
          </h2>
          
          <motion.p
            className="neural-body text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join forward-thinking enterprises who've transformed their operations with X-SevenAI. 
            Start your autonomous future today.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button className="neural-btn-primary group text-lg px-12 py-6" onClick={() => window.location.href = '/auth'}>
              Start Free Trial
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" className="neural-btn-ghost group text-lg px-12 py-6" onClick={() => window.location.href = '/auth'}>
              <Calendar className="mr-3 h-6 w-6" />
              Talk to Sales
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          {[
            {
              title: "Free Trial",
              description: "No credit card required",
              highlight: "30 days"
            },
            {
              title: "Setup Time",
              description: "From signup to first automation",
              highlight: "< 5 minutes"
            },
            {
              title: "Support",
              description: "Expert onboarding included",
              highlight: "24/7"
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              className="neural-glass p-8 relative overflow-hidden group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="neural-heading text-3xl text-primary mb-2">{item.highlight}</div>
                <div className="neural-subheading text-lg mb-1">{item.title}</div>
                <div className="neural-body text-sm text-muted-foreground">{item.description}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Company Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-16 border-t border-border"
        >
          <p className="neural-subheading text-2xl text-muted-foreground">
            <span className="text-primary font-orbitron">X-SevenAI</span> — Enterprise Autonomy. Redefined.
          </p>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default FinalCTA;