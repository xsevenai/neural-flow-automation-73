import { motion } from "framer-motion";
import { ArrowRight, Database, Cpu, BarChart3 } from "lucide-react";
import architectureImage from "@/assets/neural-architecture.jpg";

const ArchitectureFlow = () => {
  const flowSteps = [
    {
      icon: Database,
      title: "Data Inputs",
      description: "CRM, ERP, APIs, Documents",
      position: "left"
    },
    {
      icon: Cpu,
      title: "X-SevenAI Core",
      description: "Neural Processing & Decision Engine",
      position: "center"
    },
    {
      icon: BarChart3,
      title: "Automated Outputs",
      description: "Actions, Reports, Workflows",
      position: "right"
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="neural-heading text-5xl md:text-6xl mb-6">
            Intelligent <span className="text-primary">Architecture</span>
          </h2>
          <p className="neural-body text-xl text-muted-foreground max-w-3xl mx-auto">
            A neural network that understands your business logic and executes complex workflows autonomously.
          </p>
        </motion.div>

        {/* Architecture Visualization */}
        <div className="relative">
          {/* Background Neural Network */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <img 
              src={architectureImage} 
              alt="Neural Architecture" 
              className="w-full max-w-4xl h-auto object-contain"
            />
          </div>

          {/* Flow Steps */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-center">
            {flowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Flow Arrow */}
                {index < flowSteps.length - 1 && (
                  <motion.div
                    className="hidden lg:block absolute top-1/2 -right-8 xl:-right-12 transform -translate-y-1/2 z-20"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
                    viewport={{ once: true }}
                  >
                    <ArrowRight className="h-8 w-8 text-primary neural-pulse" />
                  </motion.div>
                )}

                {/* Step Card */}
                <div className={`neural-glass p-8 text-center relative overflow-hidden group ${
                  step.position === 'center' ? 'border-primary/30 shadow-lg shadow-primary/20' : ''
                }`}>
                  {/* Special glow for center card */}
                  {step.position === 'center' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                  )}
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${
                      step.position === 'center' 
                        ? 'bg-gradient-to-r from-primary to-accent' 
                        : 'bg-gradient-to-r from-surface-medium to-surface-dark'
                    } p-0.5 neural-glow`}>
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                        <step.icon className={`h-10 w-10 ${
                          step.position === 'center' ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                    </div>

                    <h3 className={`neural-subheading text-2xl mb-4 ${
                      step.position === 'center' ? 'text-primary' : 'text-foreground'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="neural-body text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  {/* Pulse effect for center card */}
                  {step.position === 'center' && (
                    <div className="absolute inset-0 border border-primary/20 rounded-[var(--radius)] neural-pulse" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { title: "Processing Speed", value: "<100ms", description: "Real-time decision making" },
            { title: "Accuracy Rate", value: "99.7%", description: "Continuously improving" }, 
            { title: "Integrations", value: "500+", description: "Pre-built connectors" }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              className="text-center neural-glass p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="neural-heading text-3xl text-primary mb-2">{stat.value}</div>
              <div className="neural-subheading text-lg mb-1">{stat.title}</div>
              <div className="neural-body text-sm text-muted-foreground">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Flow Line to Next Section */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flow-line" />
    </section>
  );
};

export default ArchitectureFlow;