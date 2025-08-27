import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Cpu, Network, Zap } from "lucide-react";

const StoryConnector = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

  const storyPoints = [
    {
      icon: Cpu,
      title: "Neural Processing",
      description: "Advanced AI algorithms analyze your business workflows"
    },
    {
      icon: Network,
      title: "Intelligent Orchestration", 
      description: "Seamlessly connects all your tools and systems"
    },
    {
      icon: Zap,
      title: "Autonomous Execution",
      description: "Executes complex tasks without human intervention"
    }
  ];

  return (
    <section ref={ref} className="relative py-40 px-6 overflow-hidden">
      {/* Background Neural Network */}
      <div className="absolute inset-0">
        <svg 
          className="w-full h-full opacity-20"
          viewBox="0 0 1000 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
              <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Neural Network Lines */}
          <motion.path
            d="M100 100 Q300 200 500 100 T900 200"
            fill="none"
            stroke="url(#neuralGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: true }}
          />
          <motion.path
            d="M100 300 Q400 150 600 300 T950 250"
            fill="none"
            stroke="url(#neuralGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
            viewport={{ once: true }}
          />
          <motion.path
            d="M50 500 Q350 350 700 450 T1000 400"
            fill="none"
            stroke="url(#neuralGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.6, ease: "easeInOut" }}
            viewport={{ once: true }}
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Central Story Element */}
        <motion.div
          style={{ y, opacity, scale }}
          className="mb-20"
        >
          <motion.div
            className="w-32 h-32 mx-auto mb-8 rounded-full neural-glass flex items-center justify-center relative"
            animate={{
              boxShadow: [
                "0 0 20px hsl(var(--primary) / 0.3)",
                "0 0 40px hsl(var(--primary) / 0.6)",
                "0 0 20px hsl(var(--primary) / 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Network className="h-16 w-16 text-primary" />
            
            {/* Floating Data Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-accent rounded-full"
                style={{
                  left: `${50 + Math.cos((i * 60) * Math.PI / 180) * 80}%`,
                  top: `${50 + Math.sin((i * 60) * Math.PI / 180) * 80}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
          
          <h2 className="neural-heading text-4xl md:text-6xl mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            From Concept to Creation
          </h2>
          <p className="neural-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch how X-SevenAI transforms your business processes into intelligent, 
            self-managing workflows that evolve with your needs.
          </p>
        </motion.div>

        {/* Story Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent transform -translate-y-1/2" />
          
          {storyPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                className="neural-glass p-8 text-center relative z-10"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px hsl(var(--primary) / 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <point.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="neural-subheading text-xl mb-4">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </motion.div>

              {/* Step Number */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center z-20"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.2 + 0.3 }}
                viewport={{ once: true }}
              >
                {index + 1}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Flow Arrow */}
        <motion.div
          className="mt-20 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-primary"
          >
            <ArrowDown className="h-8 w-8" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StoryConnector;