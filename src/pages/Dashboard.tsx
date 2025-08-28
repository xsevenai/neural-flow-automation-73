import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import ChatInterface from '@/components/ChatInterface';
import { Home, MessageSquare, UtensilsCrossed, LayoutGrid, QrCode, ShoppingCart, MessageCircle, User, LogOut, Plus, Trash2, Edit, Loader2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Type aliases for cleaner code
type BusinessRow = Database['public']['Tables']['businesses']['Row'];
type WorkingHourRow = Database['public']['Tables']['working_hours']['Row'];
type MenuCategoryRow = Database['public']['Tables']['menu_categories']['Row'];
type MenuItemRow = Database['public']['Tables']['menu_items']['Row'];
type TableRow = Database['public']['Tables']['tables']['Row'];
type OrderRow = Database['public']['Tables']['orders']['Row'];

const Dashboard = () => {
  // State Management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessRow | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Data States
  const [workingHours, setWorkingHours] = useState<WorkingHourRow[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategoryRow[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemRow[]>([]);
  const [tables, setTables] = useState<TableRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  
  // Form States
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Days of the week for working hours (matching database day_of_week string)
  const daysOfWeek = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
  ];

  // Fast initialization without hanging
  useEffect(() => {
    console.log('🚀 Dashboard: Fast initialization...');
    
    let mounted = true;
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.log('⚠️ Dashboard: Initialization timeout, redirecting...');
        navigate('/auth', { replace: true });
      }
    }, 10000); // 10 second timeout

    const initDashboard = async () => {
      try {
        console.log('🔍 Dashboard: Checking session...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession?.user) {
          console.log('❌ Dashboard: No session, redirecting...');
          navigate('/auth', { replace: true });
          return;
        }

        if (!mounted) return;

        console.log('✅ Dashboard: Session found, loading profile...');
        setSession(currentSession);
        setUser(currentSession.user);

        // Try to load business profile with timeout
        console.log('📊 Dashboard: Loading business profile...');
        const profilePromise = supabase
          .from('businesses')
          .select('*')
          .eq('user_id', currentSession.user.id)
          .maybeSingle();

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile query timeout')), 5000)
        );

        const { data: profile, error: profileError } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any;

        if (!mounted) return;

        if (profileError) {
          console.error('❌ Dashboard: Profile error:', profileError);
          if (profileError.message.includes('timeout')) {
            toast({
              title: "Loading Issue",
              description: "Profile loading is slow. Please refresh the page.",
              variant: "destructive",
            });
          }
          navigate('/auth', { replace: true });
          return;
        }

        if (!profile) {
          console.log('❌ Dashboard: No business profile, need to create one');
          toast({
            title: "Profile Required",
            description: "Please complete your business profile setup.",
            variant: "destructive",
          });
          navigate('/auth', { replace: true });
          return;
        }

        console.log('✅ Dashboard: Profile loaded:', profile.name);
        setBusinessProfile(profile);

        // Load other data without blocking
        loadAllData(profile.id);

        console.log('🎉 Dashboard: Ready!');
        
      } catch (error) {
        console.error('❌ Dashboard: Init error:', error);
        if (mounted) {
          setError('Failed to load dashboard');
          toast({
            title: "Loading Error",
            description: "Failed to load dashboard. Please try refreshing.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };

    initDashboard();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate, toast]);

  const loadAllData = async (businessId: string) => {
    try {
      console.log('📊 Dashboard: Loading business data...');
      
      // Load data in parallel but don't block UI
      Promise.all([
        loadWorkingHours(businessId),
        loadMenuData(businessId),
        loadTables(businessId),
        loadOrders(businessId)
      ]).catch(error => {
        console.error('❌ Dashboard: Error loading data:', error);
        // Don't show error toast for background data loading
      });
      
    } catch (error) {
      console.error('❌ Dashboard: Data loading error:', error);
    }
  };

  const loadWorkingHours = async (businessId: string) => {
    try {
      const { data, error } = await supabase
        .from('working_hours')
        .select('*')
        .eq('business_id', businessId)
        .order('day_of_week');

      if (error) throw error;
      setWorkingHours(data || []);
    } catch (error) {
      console.error('Error loading working hours:', error);
    }
  };

  const loadMenuData = async (businessId: string) => {
    try {
      const [categoriesResult, itemsResult] = await Promise.all([
        supabase
          .from('menu_categories')
          .select('*')
          .eq('business_id', businessId)
          .order('sort_order'),
        supabase
          .from('menu_items')
          .select('*')
          .eq('business_id', businessId)
          .order('name')
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (itemsResult.error) throw itemsResult.error;

      setMenuCategories(categoriesResult.data || []);
      setMenuItems(itemsResult.data || []);
    } catch (error) {
      console.error('Error loading menu data:', error);
    }
  };

  const loadTables = async (businessId: string) => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('business_id', businessId)
        .order('table_number');

      if (error) throw error;
      setTables(data || []);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const loadOrders = async (businessId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('👋 Dashboard: Logging out...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Dashboard: Logout error:', error);
        toast({
          title: "Logout Error",
          description: "Failed to log out. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('✅ Dashboard: Logout successful');
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
        navigate('/auth', { replace: true });
      }
    } catch (error) {
      console.error('❌ Dashboard: Unexpected logout error:', error);
      toast({
        title: "Logout Error",
        description: "An unexpected error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  const addMenuCategory = async () => {
    if (!businessProfile || !newCategoryName.trim() || isCreatingCategory) return;

    setIsCreatingCategory(true);
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .insert([{
          business_id: businessProfile.id,
          name: newCategoryName.trim(),
          description: '',
          sort_order: menuCategories.length
        }])
        .select()
        .single();

      if (error) throw error;

      setMenuCategories(prev => [...prev, data]);
      setNewCategoryName('');
      
      toast({
        title: "Category Added",
        description: `"${data.name}" has been added to your menu.`,
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const deleteMenuCategory = async (categoryId: string) => {
    if (!businessProfile) return;

    try {
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', categoryId)
        .eq('business_id', businessProfile.id);

      if (error) throw error;

      setMenuCategories(prev => prev.filter(cat => cat.id !== categoryId));
      
      toast({
        title: "Category Deleted",
        description: "The category has been removed from your menu.",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-destructive/20 bg-destructive/5">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Dashboard Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
              variant="outline"
            >
              Refresh Page
            </Button>
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full"
              variant="secondary"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show no profile state
  if (!businessProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-muted/20 bg-muted/5">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">Profile Required</CardTitle>
            <CardDescription>
              Please complete your business profile to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'tables', label: 'Tables', icon: LayoutGrid },
    { id: 'hours', label: 'Working Hours', icon: Clock },
  ];

  // Get today's orders
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(order => 
    order.created_at.startsWith(today)
  );

  // Render main content based on active section
  const renderMainContent = () => {
    switch (activeSection) {
      case 'chat':
        return <ChatInterface businessName={businessProfile.name} />;

      case 'menu':
        return (
          <div className="space-y-6 h-full overflow-y-auto">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Menu Management</h1>
              <p className="text-muted-foreground mb-6">Manage your restaurant menu categories and items</p>
            </div>

            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Menu Categories</CardTitle>
                <CardDescription>Organize your menu items into categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new category (e.g., Appetizers, Main Courses)"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-background/50 border-border/30"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newCategoryName.trim()) {
                        addMenuCategory();
                      }
                    }}
                  />
                  <Button 
                    onClick={addMenuCategory}
                    disabled={!newCategoryName.trim() || isCreatingCategory}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isCreatingCategory ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="space-y-3">
                  {menuCategories.length > 0 ? (
                    menuCategories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between border border-border/30 bg-background/50 rounded-lg p-3">
                        <div>
                          <h3 className="text-foreground font-medium">{category.name}</h3>
                          {category.description && (
                            <p className="text-muted-foreground text-sm">{category.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => deleteMenuCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground text-center py-8">
                      No categories added yet. Add your first category to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'tables':
        return (
          <div className="space-y-6 h-full overflow-y-auto">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Table Management</h1>
              <p className="text-muted-foreground mb-6">Manage your restaurant tables and QR codes</p>
            </div>

            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Restaurant Tables</CardTitle>
                <CardDescription>View and manage your table setup</CardDescription>
              </CardHeader>
              <CardContent>
                {tables.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tables.map((table) => (
                      <div key={table.id} className="border border-border/30 bg-background/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-foreground font-medium">Table {table.table_number}</h3>
                          <Badge variant={table.is_active ? "default" : "secondary"}>
                            {table.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          Capacity: {table.seats} guests
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-border/30"
                        >
                          <QrCode className="mr-2 h-4 w-4" />
                          Generate QR Code
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center py-8">
                    No tables configured yet. Contact support to set up your tables.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'hours':
        return (
          <div className="space-y-6 h-full overflow-y-auto">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Working Hours</h1>
              <p className="text-muted-foreground mb-6">Configure your restaurant operating hours</p>
            </div>

            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Weekly Schedule</CardTitle>
                <CardDescription>Set your opening and closing times for each day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {daysOfWeek.map((day) => {
                    const dayHours = workingHours.find(h => h.day_of_week === day);
                    const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
                    return (
                      <div key={day} className="flex items-center justify-between border border-border/30 bg-background/50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-foreground font-medium w-20">{dayLabel}</span>
                          <Switch
                            checked={dayHours ? dayHours.is_open : false}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={dayHours?.open_time || "09:00"}
                            className="w-24 bg-background/50 border-border/30"
                            disabled={!dayHours?.is_open}
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input
                            type="time"
                            value={dayHours?.close_time || "22:00"}
                            className="w-24 bg-background/50 border-border/30"
                            disabled={!dayHours?.is_open}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Save Working Hours
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6 h-full overflow-y-auto">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h1>
              <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today's Orders</p>
                      <p className="text-2xl font-bold text-foreground">{todayOrders.length}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Menu Items</p>
                      <p className="text-2xl font-bold text-foreground">{menuItems.length}</p>
                    </div>
                    <UtensilsCrossed className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tables</p>
                      <p className="text-2xl font-bold text-foreground">{tables.length}</p>
                    </div>
                    <LayoutGrid className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {todayOrders.length > 0 ? (
                  <div className="space-y-3">
                    {todayOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border border-border/30 rounded-lg p-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge variant="secondary">{order.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No orders yet today</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  // Three Panel Dashboard Layout - Clean Professional Design
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto h-[calc(100vh-3rem)] flex gap-6">
        
        {/* Left Panel - Navigation (No borders) */}
        <div className="w-64 bg-card rounded-3xl p-6 flex flex-col shadow-2xl">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground neural-heading">{businessProfile.name}</h2>
            <p className="text-sm text-muted-foreground">Enterprise Dashboard</p>
          </div>
          
          <nav className="flex-1 space-y-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-medium/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          
          <div className="pt-6 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-medium/50 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Center Panel - Main Content (Clean) */}
        <div className="flex-1 bg-card rounded-3xl p-8 overflow-hidden shadow-2xl">
          {renderMainContent()}
        </div>

        {/* Right Panel - Analytics/Stats (Clean) */}
        <div className="w-80 bg-card rounded-3xl p-6 flex flex-col shadow-2xl">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground neural-heading">Analytics</h3>
            <p className="text-sm text-muted-foreground">Live business insights</p>
          </div>
          
          <div className="space-y-6 flex-1">
            <Card className="bg-surface-medium/50 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Today's Revenue</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${todayOrders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface-medium/50 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Active Tables</p>
                  <p className="text-2xl font-bold text-foreground">
                    {tables.filter(t => t.is_active).length}/{tables.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface-medium/50 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Pending Orders</p>
                  <p className="text-2xl font-bold text-foreground">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <h4 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h4>
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="text-xs p-3 bg-surface-medium/30 rounded-lg">
                    <p className="text-foreground font-medium">Order #{order.id.slice(0, 6)}</p>
                    <p className="text-muted-foreground">${order.total_amount.toFixed(2)} • {order.status}</p>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;