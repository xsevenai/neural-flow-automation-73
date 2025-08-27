import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Building2, User, Mail, Lock, Phone, Globe, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  // Check URL hash to default to signup
  useEffect(() => {
    if (window.location.hash === '#signup') {
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
    // Simulate slug availability check
    setTimeout(() => {
      setSlugAvailable(Math.random() > 0.3); // 70% chance available
    }, 500);
  };

  const handleEmailChange = (value: string) => {
    setOwnerEmail(value);
    // Simulate email availability check
    if (value.includes('@')) {
      setTimeout(() => {
        setEmailAvailable(Math.random() > 0.2); // 80% chance available
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
    // Simulate login
    setTimeout(() => {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
      });
      setLoading(false);
      // Redirect to dashboard
    }, 1000);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessName || !businessSlug || !ownerName || !ownerEmail || !ownerPassword) {
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
    // Simulate signup
    setTimeout(() => {
      toast({
        title: "Account Created!",
        description: "Welcome to X-SevenAI! Your trial has started.",
      });
      setLoading(false);
      // Redirect to onboarding completion
    }, 2000);
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

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          <Card className="neural-card border-primary/20 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="text-3xl bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent neural-heading">
                  X-SevenAI
                </CardTitle>
                <CardDescription className="text-lg mt-2 neural-body">
                  Enterprise Business Automation Platform
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent>
              <Tabs value={isLogin ? "login" : "signup"} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger 
                    value="login" 
                    onClick={() => setIsLogin(true)}
                    className="neural-tab"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    onClick={() => setIsLogin(false)}
                    className="neural-tab"
                  >
                    Start Free Trial
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="login-email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
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
                        <Label htmlFor="login-password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Password
                        </Label>
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
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full neural-button"
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-6">
                    
                    {/* Business Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-primary neural-subheading">Business Information</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      </div>

                      <div>
                        <Label htmlFor="business-category">Business Category</Label>
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
                        {businessCategory && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 p-3 bg-primary/10 rounded-lg border border-primary/20"
                          >
                            <div className="flex items-center gap-2 text-sm text-primary">
                              <TrendingUp className="h-4 w-4" />
                              <span>Perfect! We'll customize your AI automation features for this industry.</span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Owner Details */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-primary neural-subheading">Admin/Owner Details</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      </div>
                    </div>

                    {/* Trial Benefits */}
                    <motion.div 
                      className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg border border-primary/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        Your Free Trial Includes:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>14-day full access trial</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>AI workflow automation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Customer management tools</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>24/7 support & onboarding</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Agreement Checkboxes */}
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

                    <Button
                      type="submit"
                      disabled={loading || !agreeTerms || !agreePrivacy}
                      className="w-full neural-button"
                    >
                      {loading ? "Creating Your Account..." : "Start Free Trial"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;