import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Crown, Zap, Building2, Star, Shield, Headphones, Globe, Users, TrendingUp, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const plans = [
    {
      id: "starter",
      name: "AI Starter",
      icon: <Zap className="h-6 w-6" />,
      price: "$49",
      period: "per month",
      description: "Perfect for small businesses getting started with AI automation",
      popular: false,
      features: [
        "Up to 1,000 AI-powered customer interactions",
        "Basic workflow automation (5 workflows)",
        "Email & chat support",
        "Standard analytics dashboard",
        "API access with rate limits",
        "2 team member seats",
        "Basic integrations (10+ apps)",
        "Mobile app access"
      ],
      limits: {
        interactions: "1,000/month",
        workflows: "5 active",
        storage: "10 GB",
        support: "Email & Chat"
      }
    },
    {
      id: "professional",
      name: "AI Professional",
      icon: <Bot className="h-6 w-6" />,
      price: "$149",
      period: "per month",
      description: "Advanced AI capabilities for growing businesses",
      popular: true,
      features: [
        "Up to 10,000 AI-powered customer interactions",
        "Advanced workflow automation (25 workflows)",
        "Priority support + phone support",
        "Advanced analytics & AI insights",
        "Full API access with higher limits",
        "10 team member seats",
        "Premium integrations (50+ apps)",
        "Custom AI model training",
        "Multi-language support",
        "Advanced security features"
      ],
      limits: {
        interactions: "10,000/month",
        workflows: "25 active",
        storage: "100 GB",
        support: "Priority + Phone"
      }
    },
    {
      id: "enterprise",
      name: "AI Enterprise",
      icon: <Crown className="h-6 w-6" />,
      price: "$399",
      period: "per month",
      description: "Enterprise-grade AI automation with unlimited scale",
      popular: false,
      features: [
        "Unlimited AI-powered customer interactions",
        "Unlimited workflow automation",
        "Dedicated customer success manager",
        "Enterprise analytics & custom reports",
        "Unlimited API access",
        "Unlimited team members",
        "All integrations + custom connectors",
        "White-label solutions",
        "On-premise deployment options",
        "Advanced compliance (SOC 2, HIPAA)",
        "Custom AI model development",
        "24/7 priority support"
      ],
      limits: {
        interactions: "Unlimited",
        workflows: "Unlimited",
        storage: "Unlimited",
        support: "24/7 Dedicated"
      }
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Plan Selected!",
        description: `Welcome to X-SevenAI ${plans.find(p => p.id === planId)?.name}! Your trial has started.`,
      });
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleStartTrial = () => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Free Trial Started!",
        description: "Welcome to X-SevenAI! You can upgrade anytime during your trial.",
      });
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface-dark relative overflow-hidden">
      {/* Neural background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="neural-grid"></div>
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
          className="text-foreground/70 hover:text-foreground neural-glow"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center neural-glow">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent neural-heading">
              X-SevenAI
            </h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 neural-heading">Choose Your AI Plan</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Select the perfect plan to transform your business with enterprise-grade AI automation.
            Start with a 14-day free trial on any plan.
          </p>

          {/* Trial Notice */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 text-primary">
              <Star className="h-5 w-5" />
              <span className="font-semibold">14-Day Free Trial • No Credit Card Required • Cancel Anytime</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              <Card className={`neural-card h-full transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-primary/50 shadow-lg shadow-primary/20 neural-glow' 
                  : 'border-primary/20'
              } ${selectedPlan === plan.id ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 neural-glow">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${plan.popular ? 'bg-primary/20' : 'bg-muted'}`}>
                      {plan.icon}
                    </div>
                    <CardTitle className="text-xl neural-subheading">{plan.name}</CardTitle>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Limits */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
                    <div className="text-center">
                      <div className="font-semibold text-primary">{plan.limits.interactions}</div>
                      <div className="text-xs text-muted-foreground">AI Interactions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-primary">{plan.limits.workflows}</div>
                      <div className="text-xs text-muted-foreground">Workflows</div>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={loading && selectedPlan === plan.id}
                    className={`w-full ${
                      plan.popular 
                        ? 'neural-button bg-gradient-to-r from-primary to-accent' 
                        : 'neural-button'
                    }`}
                  >
                    {loading && selectedPlan === plan.id 
                      ? "Starting Trial..." 
                      : `Start ${plan.name} Trial`
                    }
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Alternative Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-4"
        >
          <p className="text-muted-foreground">Not ready to choose? Start exploring with our basic trial.</p>
          <Button
            variant="outline"
            onClick={handleStartTrial}
            disabled={loading && !selectedPlan}
            className="neural-button"
          >
            {loading && !selectedPlan ? "Starting Trial..." : "Start Basic Trial"}
          </Button>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/20 to-accent/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Enterprise Security</h3>
            <p className="text-sm text-muted-foreground">Bank-level encryption and compliance standards</p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/20 to-accent/10 rounded-full flex items-center justify-center">
              <Headphones className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">Expert support whenever you need it</p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/20 to-accent/10 rounded-full flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Global Scale</h3>
            <p className="text-sm text-muted-foreground">Deploy worldwide with 99.9% uptime guarantee</p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/20 to-accent/10 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Proven ROI</h3>
            <p className="text-sm text-muted-foreground">Average 300% increase in operational efficiency</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;