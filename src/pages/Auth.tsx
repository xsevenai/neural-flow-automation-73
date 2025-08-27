import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auth form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Business profile states
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessState, setBusinessState] = useState("");
  const [businessCountry, setBusinessCountry] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industryType, setIndustryType] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            navigate("/");
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !businessName || !businessEmail || !businessCategory) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create business profile
        const { error: profileError } = await supabase
          .from("business_profiles")
          .insert([
            {
              user_id: data.user.id,
              business_name: businessName,
              business_email: businessEmail,
              business_category: businessCategory,
              business_address: businessAddress,
              business_city: businessCity,
              business_state: businessState,
              business_country: businessCountry,
              business_phone: businessPhone,
              business_website: businessWebsite,
              company_size: companySize,
              industry_type: industryType,
            },
          ]);

        if (profileError) throw profileError;

        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const businessCategories = [
    "Technology",
    "Healthcare",
    "Finance",
    "Retail",
    "Manufacturing",
    "Education",
    "Real Estate",
    "Consulting",
    "Other"
  ];

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "500+ employees"
  ];

  const industries = [
    "Software/SaaS",
    "E-commerce",
    "Healthcare",
    "Financial Services",
    "Manufacturing",
    "Education",
    "Professional Services",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
      {/* Neural background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="neural-grid"></div>
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
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
          className="w-full max-w-2xl"
        >
          <Card className="neural-card border-primary/20 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="text-3xl bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  X-SevenAI
                </CardTitle>
                <CardDescription className="text-lg mt-2">
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
                    Create Account
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="neural-input"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                    {/* Account Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-primary">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="signup-email">Email *</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="neural-input"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="signup-password">Password *</Label>
                          <Input
                            id="signup-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="neural-input"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-primary">Business Information</h3>
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
                          <Label htmlFor="business-email">Business Email *</Label>
                          <Input
                            id="business-email"
                            type="email"
                            value={businessEmail}
                            onChange={(e) => setBusinessEmail(e.target.value)}
                            placeholder="contact@company.com"
                            className="neural-input"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="business-category">Business Category *</Label>
                          <Select value={businessCategory} onValueChange={setBusinessCategory}>
                            <SelectTrigger className="neural-input">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {businessCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="company-size">Company Size</Label>
                          <Select value={companySize} onValueChange={setCompanySize}>
                            <SelectTrigger className="neural-input">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {companySizes.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="industry-type">Industry Type</Label>
                          <Select value={industryType} onValueChange={setIndustryType}>
                            <SelectTrigger className="neural-input">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="business-phone">Phone Number</Label>
                          <Input
                            id="business-phone"
                            value={businessPhone}
                            onChange={(e) => setBusinessPhone(e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="neural-input"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="business-website">Website</Label>
                        <Input
                          id="business-website"
                          value={businessWebsite}
                          onChange={(e) => setBusinessWebsite(e.target.value)}
                          placeholder="https://company.com"
                          className="neural-input"
                        />
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-primary">Business Address</h3>
                      <div>
                        <Label htmlFor="business-address">Street Address</Label>
                        <Textarea
                          id="business-address"
                          value={businessAddress}
                          onChange={(e) => setBusinessAddress(e.target.value)}
                          placeholder="123 Business St, Suite 100"
                          className="neural-input min-h-[80px]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="business-city">City</Label>
                          <Input
                            id="business-city"
                            value={businessCity}
                            onChange={(e) => setBusinessCity(e.target.value)}
                            placeholder="City"
                            className="neural-input"
                          />
                        </div>
                        <div>
                          <Label htmlFor="business-state">State/Province</Label>
                          <Input
                            id="business-state"
                            value={businessState}
                            onChange={(e) => setBusinessState(e.target.value)}
                            placeholder="State"
                            className="neural-input"
                          />
                        </div>
                        <div>
                          <Label htmlFor="business-country">Country</Label>
                          <Input
                            id="business-country"
                            value={businessCountry}
                            onChange={(e) => setBusinessCountry(e.target.value)}
                            placeholder="Country"
                            className="neural-input"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full neural-button"
                    >
                      {loading ? "Creating Account..." : "Create Business Account"}
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