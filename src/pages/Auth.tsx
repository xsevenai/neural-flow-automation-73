import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, Mail, Lock, Phone, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

const NeuralBrainAnimation = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Dropping Circles from all sides */}
      {[...Array(16)].map((_, i) => {
        const side = i % 4; // 0: top, 1: right, 2: bottom, 3: left
        let startX, startY, endX, endY;
        
        switch(side) {
          case 0: // top
            startX = Math.random() * 320;
            startY = -20;
            endX = 120 + (i - 8) * 15;
            endY = 100 + Math.random() * 80;
            break;
          case 1: // right
            startX = 340;
            startY = Math.random() * 320;
            endX = 200 + Math.random() * 80;
            endY = 120 + (i - 8) * 15;
            break;
          case 2: // bottom
            startX = Math.random() * 320;
            startY = 340;
            endX = 120 + (i - 8) * 15;
            endY = 200 + Math.random() * 80;
            break;
          default: // left
            startX = -20;
            startY = Math.random() * 320;
            endX = 40 + Math.random() * 80;
            endY = 120 + (i - 8) * 15;
        }

        return (
          <motion.div
            key={`circle-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-br from-primary to-accent rounded-full"
            initial={{ 
              x: startX,
              y: startY,
              opacity: 0.8,
              scale: 0.5
            }}
            animate={{ 
              y: endY,
              x: endX,
              scale: 1,
              opacity: 0.3
            }}
            transition={{ 
              duration: 2 + Math.random(),
              delay: i * 0.1,
              ease: "easeOut"
            }}
          />
        );
      })}

      {/* Neural Network Formation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
        className="absolute inset-0"
      >
        {/* Central Brain Core */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-primary via-accent to-secondary rounded-full neural-glow"
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
          const radius = 60;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <motion.div
              key={`node-${i}`}
              className="absolute w-3 h-3 bg-gradient-to-br from-accent to-primary rounded-full"
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
            const radius = 60;
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
                  delay: 2.5 + i * 0.1,
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`pulse-${i}`}
              className="absolute top-1/2 left-1/2 w-24 h-24 border border-primary/30 rounded-full"
              style={{ transform: 'translate(-50%, -50%)' }}
              animate={{ 
                scale: [0, 2.5],
                opacity: [0.8, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const Auth = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Business onboarding states
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessState, setBusinessState] = useState("");
  const [businessCountry, setBusinessCountry] = useState("US");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Modern authentication setup
  useEffect(() => {
    console.log('🚀 Initializing authentication system...');
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Set up the auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log(`🔄 Auth state changed: ${event}`, session?.user?.id || 'no user');
            
            if (!mounted) return;
            
            if (event === 'SIGNED_IN' && session?.user) {
              console.log('✅ User signed in successfully');
              setSession(session);
              setUser(session.user);
              
              // Process the authentication success
              await handleAuthSuccess(session.user);
              
            } else if (event === 'SIGNED_OUT') {
              console.log('👋 User signed out');
              setSession(null);
              setUser(null);
              setBusinessProfile(null);
              setLoading(false);
              navigate('/auth');
            }
          }
        );

        // Check for existing session
        console.log('🔍 Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session check error:', error);
          if (mounted) setLoading(false);
          return;
        }
        
        if (session?.user && mounted) {
          console.log('🔑 Found existing session for user:', session.user.id);
          setSession(session);
          setUser(session.user);
          await handleAuthSuccess(session.user);
        } else {
          console.log('📭 No existing session found');
          if (mounted) setLoading(false);
        }

        return subscription;
        
      } catch (error) {
        console.error('💥 Auth initialization error:', error);
        if (mounted) setLoading(false);
      }
    };

    const subscription = initializeAuth();

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      mounted = false;
      subscription.then(sub => sub?.unsubscribe()).catch(console.error);
    };
  }, [navigate]);

  // Check URL hash for login or signup
  useEffect(() => {
    const hash = window.location.hash;
    console.log('URL hash:', hash);
    if (hash === '#login') {
      setIsLogin(true);
    } else if (hash === '#signup') {
      setIsLogin(false);
    }
  }, []);


  const handleAuthSuccess = async (user: SupabaseUser) => {
    console.log('🔐 Authentication Success - Processing user:', user.id);
    
    try {
      setLoading(true);
      
      // Wait a moment for the auth context to fully initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('📊 Checking business profile for user...');
      
      // Use the current session state instead of calling getSession again
      console.log('✅ Using current session data, querying business profile...');
      
      // Query the business profile directly - the user is already authenticated
      const { data: profile, error: profileError } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('📋 Profile query completed:', { 
        hasProfile: !!profile, 
        error: profileError,
        userId: user.id,
        profileData: profile ? { id: profile.id, name: profile.name } : null
      });

      if (profileError) {
        console.error('❌ Database error fetching profile:', profileError);
        throw new Error(`Failed to load business profile: ${profileError.message}`);
      }

      if (profile) {
        console.log('🏢 Business profile found - redirecting to dashboard');
        setBusinessProfile(profile);
        setLoading(false);
        
        toast({
          title: "Welcome back!",
          description: `Welcome to ${profile.name}`,
        });
        
        navigate('/dashboard');
        return;
      }
      
      // No business profile found - handle new user setup
      console.log('👤 No business profile found - checking for signup data');
      
      const tempBusinessData = localStorage.getItem('tempBusinessData');
      const tempAdminData = localStorage.getItem('tempAdminData');
      
      if (tempBusinessData && !isLogin) {
        // New user from signup process
        console.log('🆕 Creating business profile for new user');
        await createBusinessProfileFromSignup(user, tempBusinessData, tempAdminData);
      } else if (isLogin) {
        // Existing user trying to login but no business profile
        console.log('⚠️ Login attempt but no business profile exists');
        setLoading(false);
        toast({
          title: "Account Setup Required",
          description: "Please complete your business setup first.",
          variant: "destructive",
        });
        setIsLogin(false);
        setCurrentStep(1);
      } else {
        // Unknown state
        console.log('❓ Unknown state - staying on auth page');
        setLoading(false);
      }
      
    } catch (error: any) {
      console.error('💥 Error in handleAuthSuccess:', error);
      setLoading(false);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to complete authentication",
        variant: "destructive",
      });
    }
  };

  const createBusinessProfileFromSignup = async (user: SupabaseUser, tempBusinessData: string, tempAdminData: string | null) => {
    try {
      console.log('🏗️ Creating business and admin profiles...');
      
      const businessData = JSON.parse(tempBusinessData);
      const adminData = tempAdminData ? JSON.parse(tempAdminData) : null;
      
      // Create admin profile first
      if (adminData) {
        console.log('👨‍💼 Creating admin profile...');
        const { error: adminError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            email: adminData.ownerEmail,
          });

        if (adminError) {
          console.error('❌ Error creating admin profile:', adminError);
          // Continue anyway - admin profile is optional
        }
      }

      // Create business profile
      console.log('🏢 Creating business profile...');
      const { data: newBusiness, error: profileError } = await supabase
        .from('businesses')
        .insert({
          user_id: user.id,
          name: businessData.businessName,
          slug: businessData.businessName.toLowerCase().replace(/\s+/g, '-'),
          category: businessData.businessType,
          description: businessData.businessEmail,
          contact_info: {
            email: businessData.businessEmail,
            phone: businessData.businessPhone,
            address: businessData.businessAddress,
            city: businessData.businessCity,
            state: businessData.businessState,
            country: businessData.businessCountry
          }
        })
        .select()
        .single();

      if (profileError) {
        console.error('❌ Error creating business profile:', profileError);
        throw new Error(`Failed to create business profile: ${profileError.message}`);
      }

      console.log('✅ Business profile created successfully');

      // Create default working hours
      if (newBusiness) {
        console.log('⏰ Creating default working hours...');
        const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const workingHoursData = daysOfWeek.map(day => ({
          business_id: newBusiness.id,
          day_of_week: day,
          open_time: day === 'saturday' || day === 'sunday' ? '10:00' : '09:00',
          close_time: day === 'saturday' || day === 'sunday' ? '23:00' : '22:00',
          is_open: true
        }));

        await supabase
          .from('working_hours')
          .insert(workingHoursData);
      }

      // Clean up temporary data
      localStorage.removeItem('tempBusinessData');
      localStorage.removeItem('tempAdminData');
      
      console.log('🎉 Business setup complete - redirecting to dashboard');
      setBusinessProfile(newBusiness);
      setLoading(false);
      
      toast({
        title: "Welcome to your business!",
        description: `${businessData.businessName} is ready to go!`,
      });
      
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('💥 Error creating business profile:', error);
      localStorage.removeItem('tempBusinessData');
      localStorage.removeItem('tempAdminData');
      setLoading(false);
      
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to create business profile",
        variant: "destructive",
      });
    }
  };

  const createBusinessProfile = async (user: SupabaseUser) => {
    await createBusinessProfileFromSignup(user, localStorage.getItem('tempBusinessData') || '{}', localStorage.getItem('tempAdminData'));
  };


  const businessTypes = [
    { value: "Restaurant", label: "Restaurant" },
    { value: "Cafe", label: "Cafe" },
    { value: "Bar", label: "Bar" },
    { value: "Fast Food", label: "Fast Food" },
    { value: "Food Truck", label: "Food Truck" },
    { value: "Catering", label: "Catering" },
    { value: "Other", label: "Other" }
  ];

  const validatePassword = (password: string) => {
    return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    console.log('🔐 Starting login process for:', loginEmail);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error) {
        console.error('❌ Login error from Supabase:', error);
        throw error;
      }

      console.log('✅ Login request successful');
      
      // Don't set loading to false here - let the auth state change handle it
      // The auth state listener will automatically call handleAuthSuccess
      
    } catch (error: any) {
      console.error('💥 Login failed:', error);
      setLoading(false);
      
      let errorMessage = "Invalid email or password";
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please check your email and confirm your account";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!businessName || !businessType || !businessEmail) {
        toast({
          title: "Error",
          description: "Please fill in all required business information fields",
          variant: "destructive",
        });
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessName || !businessType || !businessEmail || !ownerName || !ownerEmail || !ownerPassword) {
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

    if (ownerPassword !== confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!agreeTerms) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms of service",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Store business data temporarily in localStorage for the auth success handler
      const businessData = {
        businessName,
        businessType,
        businessEmail,
        businessPhone: businessPhone || null,
        businessAddress: businessAddress || null,
        businessCity: businessCity || null,
        businessState: businessState || null,
        businessCountry
      };
      
      // Store admin data separately
      const adminData = {
        ownerName,
        ownerEmail
      };
      
      localStorage.setItem('tempBusinessData', JSON.stringify(businessData));
      localStorage.setItem('tempAdminData', JSON.stringify(adminData));

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: ownerEmail.trim(),
        password: ownerPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: ownerName,
            business_name: businessName
          }
        }
      });

      if (authError) {
        throw authError;
      }

      toast({
        title: "Account Created!",
        description: authData.session ? 
          "Welcome! Setting up your business profile..." :
          "Account created! Setting up your business profile...",
      });

      // Handle both confirmed and unconfirmed email scenarios
      if (authData.session) {
        // Email confirmation disabled or auto-confirmed - user is logged in
        await handleAuthSuccess(authData.user);
      } else if (authData.user && !authData.user.email_confirmed_at) {
        // Email confirmation required but we'll create the business profile anyway
        // and redirect to dashboard - they can verify email later
        await createBusinessProfile(authData.user);
      }

      // If email confirmation is disabled, user will be automatically signed in
      // and handleAuthSuccess will create the business profile
      // Note: We keep tempBusinessData in localStorage until handleAuthSuccess processes it
      
    } catch (error: any) {
      console.error('Signup error:', error);
      localStorage.removeItem('tempBusinessData');
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const LeftSide = () => (
    <div className="w-full relative flex flex-col justify-center items-center p-12 bg-gradient-to-br from-primary/8 to-accent/8">
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-surface-dark/90 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-lg text-center space-y-6">
        {/* Neural Brain Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center items-center"
        >
          <NeuralBrainAnimation />
        </motion.div>
        
        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold text-foreground">
            Welcome to the Future
          </h2>
          <p className="text-muted-foreground text-lg">
            Transform your restaurant business with AI-powered insights and automation.
          </p>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex relative bg-background">
      {/* Neural background */}
      <div className="absolute inset-0 opacity-8 dark:opacity-5">
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
                Create Account
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
                  <p className="text-muted-foreground">Sign in to your business account</p>
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
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="neural-input pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
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
                    <h2 className="text-2xl font-bold neural-heading">Business Information</h2>
                    <p className="text-muted-foreground">Tell us about your business</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="business-name">Business Name *</Label>
                      <Input
                        id="business-name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Your Restaurant Name"
                        className="neural-input"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="business-type">Business Type *</Label>
                      <Select value={businessType} onValueChange={setBusinessType}>
                        <SelectTrigger className="neural-input bg-card border border-border">
                          <SelectValue placeholder="Select your business type" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border border-border z-50 backdrop-blur-lg">
                          {businessTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="bg-card hover:bg-accent/10 text-card-foreground">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="business-email">Business Email *</Label>
                      <Input
                        id="business-email"
                        type="email"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        placeholder="contact@yourrestaurant.com"
                        className="neural-input"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="business-phone">Business Phone</Label>
                      <Input
                        id="business-phone"
                        type="tel"
                        value={businessPhone}
                        onChange={(e) => setBusinessPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="neural-input"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="business-address">Address</Label>
                        <Input
                          id="business-address"
                          value={businessAddress}
                          onChange={(e) => setBusinessAddress(e.target.value)}
                          placeholder="123 Main St"
                          className="neural-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="business-city">City</Label>
                        <Input
                          id="business-city"
                          value={businessCity}
                          onChange={(e) => setBusinessCity(e.target.value)}
                          placeholder="New York"
                          className="neural-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="business-state">State</Label>
                        <Input
                          id="business-state"
                          value={businessState}
                          onChange={(e) => setBusinessState(e.target.value)}
                          placeholder="NY"
                          className="neural-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="business-country">Country</Label>
                        <Select value={businessCountry} onValueChange={setBusinessCountry}>
                          <SelectTrigger className="neural-input bg-background border border-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background border border-input z-50">
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                    <h2 className="text-2xl font-bold neural-heading">Account Details</h2>
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
                      <Label htmlFor="owner-email">Email Address *</Label>
                      <Input
                        id="owner-email"
                        type="email"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        placeholder="john@yourrestaurant.com"
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
                      <div className="relative">
                        <Input
                          id="owner-password"
                          type={showPassword ? "text" : "password"}
                          value={ownerPassword}
                          onChange={(e) => setOwnerPassword(e.target.value)}
                          placeholder="••••••••"
                          className="neural-input pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">Confirm Password *</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="neural-input"
                        required
                      />
                      {confirmPassword && ownerPassword !== confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                      )}
                    </div>

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
                        {" "}and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </Label>
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
                        disabled={loading || !agreeTerms || ownerPassword !== confirmPassword}
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