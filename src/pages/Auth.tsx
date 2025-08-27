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

const NeuralBrainAnimation = () => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase(1), 1000);
    const timer2 = setTimeout(() => setAnimationPhase(2), 3000);
    const timer3 = setTimeout(() => setAnimationPhase(3), 5000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Dropping Circles */}
      {animationPhase >= 1 && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`circle-${i}`}
              className="absolute w-3 h-3 bg-gradient-to-br from-primary to-accent rounded-full"
              initial={{ 
                x: Math.random() * 300,
                y: -20,
                opacity: 0.8,
                scale: 0.5
              }}
              animate={{ 
                y: 150 + Math.random() * 100,
                x: 120 + (i - 6) * 20 + Math.random() * 40,
                scale: 1,
                opacity: animationPhase >= 2 ? 0.3 : 0.8
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}

      {/* Neural Network Formation */}
      {animationPhase >= 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          {/* Central Brain Core */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-primary via-accent to-secondary rounded-full neural-glow"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Neural Nodes */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const radius = 80;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <motion.div
                key={`node-${i}`}
                className="absolute w-4 h-4 bg-gradient-to-br from-accent to-primary rounded-full"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{ 
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            );
          })}

          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45) * (Math.PI / 180);
              const radius = 80;
              const x = 160 + Math.cos(angle) * radius;
              const y = 160 + Math.sin(angle) * radius;
              
              return (
                <motion.line
                  key={`line-${i}`}
                  x1="160"
                  y1="160"
                  x2={x}
                  y2={y}
                  stroke="url(#gradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ 
                    duration: 1,
                    delay: 0.5 + i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          {/* Neural Pulses */}
          {animationPhase >= 3 && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`pulse-${i}`}
                  className="absolute top-1/2 left-1/2 w-32 h-32 border border-primary/30 rounded-full"
                  style={{ transform: 'translate(-50%, -50%)' }}
                  animate={{ 
                    scale: [0, 2],
                    opacity: [0.8, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.75,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      )}
    </div>
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
    <div className="w-full relative flex flex-col justify-center items-center p-12 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-surface-dark/90"></div>
      <div className="relative z-10 max-w-lg text-center space-y-6">
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

        {/* Neural Brain Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center items-center"
        >
          <NeuralBrainAnimation />
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-center text-foreground mb-6">
            Enterprise AI Automation
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-2 h-2 rounded-full bg-primary neural-glow"></div>
              <span className="text-sm text-muted-foreground">Intelligent Workflow Automation</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-2 h-2 rounded-full bg-accent neural-glow"></div>
              <span className="text-sm text-muted-foreground">Advanced Customer Intelligence</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-2 h-2 rounded-full bg-secondary neural-glow"></div>
              <span className="text-sm text-muted-foreground">Enterprise Security & Compliance</span>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 7 }}
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
    <div className="min-h-screen flex relative">
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
      <div className="hidden lg:flex lg:w-1/2 relative">
        <LeftSide />
      </div>

      {/* Center Divider */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent transform -translate-x-1/2 z-20"></div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background/95 backdrop-blur-sm relative">
        <div className="w-full max-w-md space-y-6">
          {/* Login/Signup Toggle */}
          <div className="space-y-1">
            <div className="flex gap-3">
              <Button
                variant={isLogin ? "default" : "outline"}
                onClick={() => setIsLogin(true)}
                className="flex-1 neural-button text-sm"
              >
                Sign In
              </Button>
              <Button
                variant={!isLogin ? "default" : "outline"}
                onClick={() => { setIsLogin(false); setCurrentStep(1); }}
                className="flex-1 neural-button text-sm"
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