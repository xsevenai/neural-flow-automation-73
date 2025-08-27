import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Building2, User, Mail, Lock, Phone, Shield, Zap, Bot, TrendingUp, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, delay + 50);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, delay]);

  return (
    <span className="inline-block">
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

const Auth = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Business onboarding states
  const [businessName, setBusinessName] = useState("");
  const [businessSlug, setBusinessSlug] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  // Check URL hash for login or signup
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#login') {
      setIsLogin(true);
    } else if (hash === '#signup') {
      setIsLogin(false);
    }
  }, []);

  const businessCategories = [
    { value: "food-hospitality", label: "Food & Hospitality", icon: "🍽️", description: "Restaurants, cafes, catering services" },
    { value: "beauty-personal-care", label: "Beauty & Personal Care", icon: "💅", description: "Salons, spas, wellness centers" },
    { value: "automotive-services", label: "Automotive Services", icon: "🚗", description: "Auto repair, car washes, dealerships" },
    { value: "health-medical", label: "Health & Medical", icon: "🏥", description: "Clinics, dental offices, medical practices" },
    { value: "local-services", label: "Local Services", icon: "🔧", description: "Home services, consulting, professional services" },
  ];

  const handleSlugChange = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setBusinessSlug(slug);
    setTimeout(() => {
      setSlugAvailable(Math.random() > 0.3);
    }, 500);
  };

  const handleEmailChange = (value: string) => {
    setOwnerEmail(value);
    if (value.includes('@')) {
      setTimeout(() => {
        setEmailAvailable(Math.random() > 0.2);
      }, 500);
    }
  };

  const validatePassword = (password: string) => {
    return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
      });
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!businessName || !businessSlug || !businessCategory) {
        toast({
          title: "Error",
          description: "Please fill in all business information fields",
          variant: "destructive",
        });
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ownerName || !ownerEmail || !ownerPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(ownerPassword)) {
      toast({
        title: "Password Error",
        description: "Password must be at least 8 characters with uppercase, lowercase, and number",
        variant: "destructive",
      });
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms of service and privacy policy",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Account Created!",
        description: "Welcome to X-SevenAI! Choose your plan to continue.",
      });
      setLoading(false);
      navigate('/subscription-plans');
    }, 2000);
  };

  const LeftSide = () => (
    <div className="relative flex flex-col justify-center items-center p-12 bg-gradient-to-br from-primary/10 to-accent/5">
      <div className="absolute inset-0 bg-gradient-to-br from-background to-surface-dark opacity-95"></div>
      <div className="relative z-10 max-w-lg text-center space-y-8">
        {/* Logo and Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center neural-glow">
            <Bot className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            X-SevenAI
          </h1>
        </motion.div>

        {/* Typewriter Headlines */}
        <div className="space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold text-foreground">
              <TypewriterText text="Transform Your Business" delay={1500} />
            </h2>
            <p className="text-lg text-muted-foreground">
              <TypewriterText text="With Enterprise-Grade AI Automation" delay={3000} />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 neural-glow"></div>
              <div>
                <h3 className="font-semibold text-foreground">Intelligent Workflow Automation</h3>
                <p className="text-sm text-muted-foreground">Streamline operations with AI-powered process optimization</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 neural-glow"></div>
              <div>
                <h3 className="font-semibold text-foreground">Advanced Customer Intelligence</h3>
                <p className="text-sm text-muted-foreground">Predict customer behavior and personalize experiences</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-secondary mt-2 neural-glow"></div>
              <div>
                <h3 className="font-semibold text-foreground">Enterprise Security & Compliance</h3>
                <p className="text-sm text-muted-foreground">Bank-level security with full regulatory compliance</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 6 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>99.9% Uptime</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Trusted by 10,000+ businesses worldwide
          </p>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Neural background */}
      <div className="absolute inset-0 opacity-5">
        <div className="neural-grid"></div>
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="text-foreground/70 hover:text-foreground neural-glow"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Left Side - Marketing Content */}
      <div className="hidden lg:flex lg:w-1/2">
        <LeftSide />
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
        <div className="w-full max-w-md">
          {/* Login/Signup Toggle */}
          <div className="mb-8">
            <div className="flex gap-4 mb-6">
              <Button
                variant={isLogin ? "default" : "outline"}
                onClick={() => setIsLogin(true)}
                className="flex-1 neural-button"
              >
                Sign In
              </Button>
              <Button
                variant={!isLogin ? "default" : "outline"}
                onClick={() => { setIsLogin(false); setCurrentStep(1); }}
                className="flex-1 neural-button"
              >
                Start Free Trial
              </Button>
            </div>
          </div>

          {isLogin ? (
            /* Login Form */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold neural-heading">Welcome Back</h2>
                  <p className="text-muted-foreground">Sign in to your X-SevenAI account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="neural-input"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="neural-input"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full neural-button"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </div>
            </motion.div>
          ) : (
            /* Signup Forms */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold neural-heading">Get Started</h2>
                    <p className="text-muted-foreground">Tell us about your business</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="business-name">Business Name *</Label>
                      <Input
                        id="business-name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Your Company Inc."
                        className="neural-input"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="business-slug" className="flex items-center justify-between">
                        Business URL *
                        {slugAvailable !== null && (
                          <span className={`text-xs ${slugAvailable ? 'text-green-500' : 'text-red-500'}`}>
                            {slugAvailable ? '✓ Available' : '✗ Taken'}
                          </span>
                        )}
                      </Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          app.x-sevenai.com/
                        </span>
                        <Input
                          id="business-slug"
                          value={businessSlug}
                          onChange={(e) => handleSlugChange(e.target.value)}
                          placeholder="your-business"
                          className="neural-input rounded-l-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="business-category">Business Category *</Label>
                      <Select value={businessCategory} onValueChange={setBusinessCategory}>
                        <SelectTrigger className="neural-input">
                          <SelectValue placeholder="Select your business category" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center gap-3">
                                <span>{category.icon}</span>
                                <div>
                                  <div className="font-medium">{category.label}</div>
                                  <div className="text-xs text-muted-foreground">{category.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleNextStep}
                    className="w-full neural-button"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold neural-heading">Admin Details</h2>
                    <p className="text-muted-foreground">Create your admin account</p>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <Label htmlFor="owner-name">Full Name *</Label>
                      <Input
                        id="owner-name"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="John Doe"
                        className="neural-input"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="owner-email" className="flex items-center justify-between">
                        Email Address *
                        {emailAvailable !== null && (
                          <span className={`text-xs ${emailAvailable ? 'text-green-500' : 'text-red-500'}`}>
                            {emailAvailable ? '✓ Available' : '✗ Already exists'}
                          </span>
                        )}
                      </Label>
                      <Input
                        id="owner-email"
                        type="email"
                        value={ownerEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="john@company.com"
                        className="neural-input"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="owner-password" className="flex items-center justify-between">
                        Password *
                        {ownerPassword && (
                          <span className={`text-xs ${validatePassword(ownerPassword) ? 'text-green-500' : 'text-yellow-500'}`}>
                            {validatePassword(ownerPassword) ? '✓ Strong' : 'Needs: 8+ chars, A-Z, a-z, 0-9'}
                          </span>
                        )}
                      </Label>
                      <Input
                        id="owner-password"
                        type="password"
                        value={ownerPassword}
                        onChange={(e) => setOwnerPassword(e.target.value)}
                        placeholder="••••••••"
                        className="neural-input"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="owner-phone">Phone Number</Label>
                      <Input
                        id="owner-phone"
                        type="tel"
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        placeholder="+1234567890"
                        className="neural-input"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="terms" 
                          checked={agreeTerms}
                          onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the{" "}
                          <a href="#" className="text-primary hover:underline">
                            Terms of Service
                          </a>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="privacy" 
                          checked={agreePrivacy}
                          onCheckedChange={(checked) => setAgreePrivacy(checked === true)}
                        />
                        <Label htmlFor="privacy" className="text-sm">
                          I agree to the{" "}
                          <a href="#" className="text-primary hover:underline">
                            Privacy Policy
                          </a>
                        </Label>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading || !agreeTerms || !agreePrivacy}
                        className="flex-1 neural-button"
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          )}

          {/* Mobile Left Side Content */}
          <div className="lg:hidden mt-12">
            <LeftSide />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;