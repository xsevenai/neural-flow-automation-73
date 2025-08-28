import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Loader2, Building, User, ArrowLeft, CheckCircle } from 'lucide-react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Type alias for cleaner code
type BusinessRow = Database['public']['Tables']['businesses']['Row'];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessRow | null>(null);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [profileData, setProfileData] = useState({
    phone: '',
    address: '',
    description: ''
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize authentication state
  useEffect(() => {
    console.log('🚀 Initializing authentication system...');
    
    let mounted = true;
    
    const initAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log(`🔄 Auth state changed: ${event}`, session?.user?.id || 'no user');
            
            if (event === 'SIGNED_IN' && session?.user) {
              setSession(session);
              setUser(session.user);
              await handleAuthenticatedUser(session.user);
            } else if (event === 'SIGNED_OUT') {
              setSession(null);
              setUser(null);
              setBusinessProfile(null);
              setShowBusinessForm(false);
            }
          }
        );

        // Check for existing session
        console.log('🔍 Checking for existing session...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user && mounted) {
          console.log('✅ Found existing session:', currentSession.user.id);
          setSession(currentSession);
          setUser(currentSession.user);
          await handleAuthenticatedUser(currentSession.user);
        }

        // Check URL hash for login/signup mode
        const hash = location.hash;
        console.log('URL hash:', hash);
        if (hash === '#login') {
          setIsLogin(true);
        } else if (hash === '#signup') {
          setIsLogin(false);
        }

        if (mounted) {
          setInitializing(false);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setInitializing(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [location.hash]);

  const handleAuthenticatedUser = async (user: SupabaseUser) => {
    try {
      console.log('🔐 Processing authenticated user:', user.id);
      
      // Check for business profile
      console.log('📊 Checking business profile...');
      const { data: profile, error: profileError } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('📋 Profile query result:', { 
        hasProfile: !!profile, 
        error: profileError,
        profileName: profile?.name 
      });

      if (profileError) {
        console.error('❌ Profile fetch error:', profileError);
        toast({
          title: "Database Error",
          description: "Failed to load your business profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (profile) {
        console.log('🏢 Business profile found - redirecting to dashboard');
        setBusinessProfile(profile);
        setShowBusinessForm(false);
        
        toast({
          title: "Welcome back!",
          description: `Successfully logged into ${profile.name}`,
        });
        
        // Add small delay to ensure UI updates before navigation
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
      } else {
        console.log('🏗️ No business profile - showing business creation form');
        setBusinessProfile(null);
        setShowBusinessForm(true);
        
        // Pre-fill form with user data if needed
        setProfileData(prev => ({
          ...prev,
        }));
        
        toast({
          title: "Complete Your Setup",
          description: "Please create your business profile to continue.",
        });
      }
    } catch (error) {
      console.error('❌ Error processing authenticated user:', error);
      toast({
        title: "Authentication Error",
        description: "There was an error setting up your account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('🔐 Starting login process for:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        
        let errorMessage = "Login failed. Please try again.";
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please check your email and confirm your account before logging in.";
        }
        
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Login successful for user:', data.user?.id);
      
      // The onAuthStateChange listener will handle the rest
      
    } catch (error) {
      console.error('❌ Unexpected login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !password || !confirmPassword || !fullName || !businessName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('🆕 Starting signup process for:', email);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName.trim(),
            business_name: businessName.trim(),
          }
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
        
        let errorMessage = "Signup failed. Please try again.";
        if (error.message.includes('already registered')) {
          errorMessage = "An account with this email already exists. Please try logging in instead.";
        }
        
        toast({
          title: "Signup Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Signup successful:', data.user?.id);

      if (data.user && !data.session) {
        // Email confirmation required
        toast({
          title: "Check Your Email",
          description: "Please check your email and click the confirmation link to complete your registration.",
        });
      } else if (data.session) {
        // Auto-confirmed (will be handled by onAuthStateChange)
        console.log('🔄 Auto-confirmed signup, processing...');
      }

    } catch (error) {
      console.error('❌ Unexpected signup error:', error);
      toast({
        title: "Signup Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBusinessProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || loading) return;

    if (!businessName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('🏗️ Creating business profile for user:', user.id);

    try {
      const businessData = {
        user_id: user.id,
        name: businessName.trim(),
        slug: businessName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
        description: profileData.description.trim() || null,
        category: 'restaurant',
      };

      const { data: newProfile, error } = await supabase
        .from('businesses')
        .insert([businessData])
        .select()
        .single();

      if (error) {
        console.error('❌ Business profile creation error:', error);
        toast({
          title: "Profile Creation Failed",
          description: "Failed to create your business profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Business profile created successfully:', newProfile.id);
      setBusinessProfile(newProfile);
      setShowBusinessForm(false);

      toast({
        title: "Profile Created!",
        description: `Welcome to ${newProfile.name}! Your business profile has been created.`,
      });

      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);

    } catch (error) {
      console.error('❌ Unexpected error creating business profile:', error);
      toast({
        title: "Creation Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during initialization
  if (initializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show business profile creation form
  if (showBusinessForm && user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-muted/20 bg-muted/5">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-foreground">Complete Your Setup</CardTitle>
            <CardDescription className="text-muted-foreground">
              Create your business profile to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createBusinessProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-foreground">Business Name *</Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Enter your business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="bg-background/50 border-muted/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profilePhone" className="text-foreground">Phone Number</Label>
                <Input
                  id="profilePhone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-background/50 border-muted/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileAddress" className="text-foreground">Address</Label>
                <Input
                  id="profileAddress"
                  type="text"
                  placeholder="123 Main St, City, State 12345"
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  className="bg-background/50 border-muted/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileDescription" className="text-foreground">Business Description</Label>
                <Input
                  id="profileDescription"
                  type="text"
                  placeholder="Brief description of your business"
                  value={profileData.description}
                  onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-background/50 border-muted/30"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Create Business Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show main auth form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-muted/20 bg-muted/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-foreground">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin 
              ? 'Sign in to your restaurant dashboard' 
              : 'Set up your restaurant management system'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-background/50 border-muted/30"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-foreground">Business Name *</Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Your Restaurant Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="bg-background/50 border-muted/30"
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-muted/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isLogin ? "Enter your password" : "Create a secure password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-muted/30 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background/50 border-muted/30 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <Separator className="my-6" />

          <div className="text-center">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setFullName('');
                setBusinessName('');
              }}
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              className="border-muted/30 text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;