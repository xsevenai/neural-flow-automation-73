import { motion } from "framer-motion";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams getting started with AI automation",
      price: "Free",
      period: "forever",
      icon: Zap,
      badge: null,
      features: [
        "Up to 5 AI workflows",
        "1,000 API calls/month",
        "Basic templates",
        "Community support",
        "Standard integrations"
      ],
      limitations: [
        "Limited customization",
        "Basic analytics"
      ]
    },
    {
      name: "Professional",
      description: "Advanced AI automation for growing businesses",
      price: "$49",
      period: "per month",
      icon: Star,
      badge: "Most Popular",
      features: [
        "Unlimited AI workflows",
        "50,000 API calls/month",
        "Advanced templates",
        "Priority support",
        "All integrations",
        "Custom training data",
        "Advanced analytics",
        "Team collaboration"
      ],
      limitations: []
    },
    {
      name: "Enterprise",
      description: "Full-scale AI orchestration for large organizations",
      price: "$199",
      period: "per month",
      icon: Crown,
      badge: "Enterprise",
      features: [
        "Unlimited everything",
        "1M+ API calls/month",
        "Custom workflows",
        "24/7 dedicated support",
        "White-label solution",
        "Custom integrations",
        "Advanced security",
        "SLA guarantee",
        "On-premise deployment"
      ],
      limitations: []
    }
  ];

  return (
    <section id="pricing" className="relative py-32 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 neural-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Floating Neural Nodes */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="neural-outline-button mb-6">
            Choose Your AI Power Level
          </Badge>
          <h2 className="neural-heading text-5xl md:text-6xl mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            Pricing That Scales
            <br />
            <span className="text-primary">With Your Ambition</span>
          </h2>
          <p className="neural-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free, upgrade as you grow. Every plan includes our core AI automation engine.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className={`h-full neural-glass relative overflow-hidden ${
                plan.badge === "Most Popular" 
                  ? "border-primary/50 shadow-[0_0_40px_hsl(var(--primary)/0.3)]" 
                  : ""
              }`}>
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Badge className={
                      plan.badge === "Most Popular" 
                        ? "neural-button" 
                        : "bg-accent text-accent-foreground"
                    }>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full neural-glass flex items-center justify-center">
                    <plan.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="neural-subheading text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  <div className="pt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="neural-heading text-4xl text-primary">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">/{plan.period}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button 
                    className={
                      plan.badge === "Most Popular" 
                        ? "w-full neural-button" 
                        : "w-full neural-outline-button"
                    }
                    onClick={() => window.location.href = '/auth'}
                  >
                    {plan.name === "Starter" ? "Start Free" : "Get Started"}
                  </Button>

                  <div className="space-y-3">
                    <h4 className="neural-subheading text-sm text-foreground/80 font-medium">
                      Everything included:
                    </h4>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-border/30">
                      <h4 className="neural-subheading text-sm text-muted-foreground font-medium mb-2">
                        Limitations:
                      </h4>
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <div className="h-4 w-4 mt-0.5 flex-shrink-0">
                            <div className="h-1 w-1 bg-muted-foreground rounded-full mt-1.5 mx-auto" />
                          </div>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">
            Need something custom? We can build it.
          </p>
          <Button variant="outline" className="neural-outline-button">
            Contact Enterprise Sales
          </Button>
        </motion.div>
      </div>

      {/* Flow Line to Next Section */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flow-line" />
    </section>
  );
};

export default PricingSection;