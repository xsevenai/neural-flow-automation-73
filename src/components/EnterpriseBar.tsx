import { motion } from "framer-motion";

const enterprises = [
  "Microsoft", "Google", "Amazon", "IBM", "Oracle", "Salesforce"
];

const EnterpriseBar = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="neural-body text-muted-foreground text-lg mb-12">
            Trusted by industry leaders worldwide
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {enterprises.map((company, index) => (
              <motion.div
                key={company}
                className="group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="neural-glass p-6 h-20 flex items-center justify-center relative overflow-hidden">
                  <span className="neural-subheading text-lg text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    {company}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            { number: "500+", label: "Enterprise Clients" },
            { number: "99.9%", label: "Uptime SLA" },
            { number: "60%", label: "Cost Reduction" },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              className="text-center neural-glass p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="neural-heading text-4xl md:text-5xl text-primary mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                viewport={{ once: true }}
              >
                {metric.number}
              </motion.div>
              <p className="neural-body text-muted-foreground">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnterpriseBar;