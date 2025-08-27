import { motion } from "framer-motion";
import { Brain, Zap, Shield, Workflow } from "lucide-react";

const values = [
  {
    icon: Brain,
    title: "Autonomous Intelligence",
    description: "Self-learning AI that adapts to your business patterns and optimizes workflows automatically.",
    gradient: "from-neural-cyan to-neural-violet"
  },
  {
    icon: Zap,
    title: "Instant Orchestration", 
    description: "Connect any system, API, or workflow in minutes. No coding required.",
    gradient: "from-neural-violet to-accent"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II, GDPR compliant with end-to-end encryption and audit trails.",
    gradient: "from-accent to-neural-chrome"
  },
  {
    icon: Workflow,
    title: "Seamless Integration",
    description: "Works with 500+ enterprise tools. Deploy in your cloud or ours.",
    gradient: "from-neural-chrome to-neural-cyan"
  }
];

const ValuePropositions = () => {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="neural-heading text-5xl md:text-6xl mb-6">
            Built for <span className="text-primary">Enterprise</span> Scale
          </h2>
          <p className="neural-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your business operations with AI that thinks, learns, and executes at the speed of thought.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="neural-glass-hover p-8 group cursor-pointer relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className="relative z-10 mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${value.gradient} p-0.5 neural-glow`}>
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="neural-subheading text-2xl mb-4 group-hover:text-primary transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="neural-body text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>

              {/* Hover Effect Lines */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Flow Line to Next Section */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flow-line" />
    </section>
  );
};

export default ValuePropositions;