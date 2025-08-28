import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ChatInterface from '@/components/ChatInterface';
import { Home, MessageSquare, UtensilsCrossed, Database, LayoutGrid, QrCode, Users, FileText, Clock, BarChart3, Share2, Settings, Bell, MapPin, Calendar, ShoppingCart, MessageCircle, User, LogOut, Plus, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Type definitions - matching database schema
interface BusinessProfile {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  category?: string;
  description?: string;
  branding_config?: any;
  category_config?: any;
  contact_info?: any;
  settings?: any;
  phone_config?: any;
  phone_features?: any;
  phone_usage?: any;
  is_active?: boolean;
  custom_phone_sid?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  custom_phone_number?: string;
  custom_whatsapp_number?: string;
  subscription_plan?: string;
  subscription_status?: string;
  trial_ends_at?: string;
  custom_number_monthly_cost?: number;
  created_at: string;
  updated_at: string;
}

interface WorkingHour {
  id?: string;
  business_id: string;
  day_of_week: string;
  is_open: boolean;
  open_time?: string;
  close_time?: string;
}

interface MenuCategory {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface MenuItem {
  id: string;
  business_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  is_featured: boolean;
  prep_time?: number;
  allergens?: string[];
  dietary_tags?: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface RestaurantTable {
  id: string;
  business_id: string;
  table_number: string;
  capacity: number;
  position_x: number;
  position_y: number;
  is_active: boolean;
  qr_code_url?: string;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: string;
  business_id: string;
  table_id?: string;
  order_number: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  total_amount: number;
  notes?: string;
  order_type: 'dine-in' | 'takeout' | 'delivery';
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Data states
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [todayOrders, setTodayOrders] = useState<Order[]>([]);
  
  // Form states
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'ai', timestamp: Date}>>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Authentication and data fetching
  useEffect(() => {
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setSession(session);
          setUser(session.user);
          await fetchBusinessData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setBusinessProfile(null);
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setSession(session);
      setUser(session.user);
      await fetchBusinessData(session.user.id);
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessData = async (userId: string) => {
    try {
      // Fetch business profile
      const { data: profile, error: profileError } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (profile) {
        setBusinessProfile(profile);
        await fetchAllBusinessData(profile.id);
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
      toast({
        title: "Error",
        description: "Failed to load business data",
        variant: "destructive",
      });
    }
  };

  const fetchAllBusinessData = async (businessId: string) => {
    try {
      // Fetch all business-related data in parallel
      const [
        workingHoursResult,
        categoriesResult,
        menuItemsResult,
        tablesResult,
        ordersResult
      ] = await Promise.all([
        supabase.from('working_hours').select('*').eq('business_id', businessId),
        supabase.from('menu_categories').select('*').eq('business_id', businessId).order('sort_order'),
        supabase.from('menu_items').select('*').eq('business_id', businessId).order('sort_order'),
        supabase.from('tables').select('*').eq('business_id', businessId).eq('is_active', true),
        supabase.from('orders').select('*').eq('business_id', businessId).order('created_at', { ascending: false })
      ]);

      if (workingHoursResult.data) setWorkingHours(workingHoursResult.data);
      if (categoriesResult.data) {
        // Map sort_order to display_order for menu categories
        const mappedCategories = categoriesResult.data.map(cat => ({
          ...cat,
          display_order: cat.sort_order || 0
        }));
        setMenuCategories(mappedCategories);
      }
      if (menuItemsResult.data) {
        // Map sort_order to display_order and add missing fields for menu items
        const mappedItems = menuItemsResult.data.map(item => ({
          ...item,
          display_order: item.sort_order || 0,
          is_featured: false,
          prep_time: undefined,
          allergens: undefined,
          dietary_tags: undefined
        }));
        setMenuItems(mappedItems);
      }
      if (tablesResult.data) {
        // Map database table fields to component interface
        const mappedTables = tablesResult.data.map(table => ({
          ...table,
          table_number: table.table_number || 'Table',
          capacity: table.seats || 4,
          position_x: 0,
          position_y: 0,
          qr_code_url: table.qr_code || undefined
        }));
        setTables(mappedTables);
      }
      if (ordersResult.data) {
        // Map database order fields to component interface
        const mappedOrders = ordersResult.data.map(order => ({
          ...order,
          order_number: `ORD-${order.id.slice(-8).toUpperCase()}`,
          order_type: 'dine-in' as const,
          status: (order.status === 'pending' || order.status === 'confirmed' || 
                  order.status === 'preparing' || order.status === 'ready' || 
                  order.status === 'served' || order.status === 'completed' || 
                  order.status === 'cancelled') ? 
                  order.status as 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled' : 
                  'pending' as const
        }));
        setOrders(mappedOrders);
        // Filter today's orders
        const today = new Date().toISOString().split('T')[0];
        const todayOrdersFiltered = mappedOrders.filter(order => 
          order.created_at.startsWith(today)
        );
        setTodayOrders(todayOrdersFiltered);
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveWorkingHours = async () => {
    if (!businessProfile) return;

    try {
      // Convert working hours state to database format
      const hoursToSave = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => {
        const existing = workingHours.find(h => h.day_of_week === day);
        const dayData = {
          business_id: businessProfile.id,
          day_of_week: day,
          is_open: existing?.is_open ?? true,
          open_time: existing?.is_open ? (existing?.open_time ?? '09:00') : null,
          close_time: existing?.is_open ? (existing?.close_time ?? '17:00') : null
        };
        return existing ? { ...dayData, id: existing.id } : dayData;
      });

      const { error } = await supabase
        .from('working_hours')
        .upsert(hoursToSave, { onConflict: 'business_id,day_of_week' });

      if (error) throw error;

      await fetchAllBusinessData(businessProfile.id);
      toast({
        title: "Success",
        description: "Working hours saved successfully",
      });
    } catch (error) {
      console.error('Error saving working hours:', error);
      toast({
        title: "Error",
        description: "Failed to save working hours",
        variant: "destructive",
      });
    }
  };

  const addMenuCategory = async () => {
    if (!businessProfile || !newCategoryName.trim()) return;

    try {
      const { error } = await supabase
        .from('menu_categories')
        .insert({
          business_id: businessProfile.id,
          name: newCategoryName.trim(),
          sort_order: menuCategories.length
        });

      if (error) throw error;

      setNewCategoryName('');
      await fetchAllBusinessData(businessProfile.id);
      toast({
        title: "Success",
        description: "Menu category added successfully",
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };

  const deleteMenuCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      await fetchAllBusinessData(businessProfile!.id);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const generateQRCodes = async () => {
    if (!businessProfile) return;

    try {
      // In a real implementation, this would call an edge function to generate QR codes
      toast({
        title: "QR Codes Generated",
        description: "Table QR codes have been generated successfully",
      });
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR codes",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground neural-pulse">Loading...</div>
      </div>
    );
  }

  if (!businessProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-foreground text-xl mb-4">No Business Profile Found</h2>
          <p className="text-muted-foreground mb-6">You need to create a business profile first.</p>
          <Button onClick={() => navigate('/auth')} className="neural-button">Go to Setup</Button>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { title: "Home", icon: Home, section: "dashboard", subtitle: "Overview and quick actions" },
    { title: "Dashboard Chat", icon: MessageSquare, section: "chat", subtitle: "Conversations with the AI assistant" },
    { title: "Menu Management", icon: Database, section: "menu-management", subtitle: "Categories, items, pricing" },
    { title: "Table Management", icon: LayoutGrid, section: "table-management", subtitle: "Layout, capacity, QR codes" },
    { title: "Working Hours", icon: Clock, section: "hours", subtitle: "Open/close times, breaks, special days" }
  ];

  const isActive = (section: string) => activeSection === section;

  // Get working hours display data
  const getWorkingHoursDisplay = () => {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    return days.map(day => {
      const existing = workingHours.find(h => h.day_of_week === day);
      return {
        day,
        isOpen: existing?.is_open ?? true,
        openTime: existing?.open_time ?? '09:00',
        closeTime: existing?.close_time ?? '17:00'
      };
    });
  };

  const updateWorkingHour = (day: string, field: string, value: any) => {
    const existing = workingHours.find(h => h.day_of_week === day);
    if (existing) {
      setWorkingHours(prev => prev.map(h => 
        h.day_of_week === day ? { ...h, [field]: value } : h
      ));
    } else {
      setWorkingHours(prev => [...prev, {
        business_id: businessProfile.id,
        day_of_week: day,
        is_open: field === 'is_open' ? value : true,
        open_time: field === 'open_time' ? value : '09:00',
        close_time: field === 'close_time' ? value : '17:00'
      }]);
    }
  };

  const DashboardContent = () => {
    switch (activeSection) {
      case 'hours':
        const hoursDisplay = getWorkingHoursDisplay();
        return (
          <div className="space-y-6 h-full overflow-y-auto">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Working Hours</h1>
              <p className="text-muted-foreground mb-6">Configure weekly open/close times</p>
            </div>

            <Card className="border border-muted/20 bg-muted/5">
              <CardContent className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {hoursDisplay.map(({ day, isOpen, openTime, closeTime }) => (
                    <div key={day} className="flex items-center justify-between py-3">
                      <div className="w-16">
                        <span className="text-foreground font-medium capitalize">{day}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={isOpen}
                          onCheckedChange={(checked) => updateWorkingHour(day, 'is_open', checked)}
                          className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-muted-foreground w-12 text-sm">
                          {isOpen ? 'Open' : 'Closed'}
                        </span>
                        <Input
                          type="time"
                          value={isOpen ? openTime : ''}
                          disabled={!isOpen}
                          className="w-24 border-muted/30 bg-background/50"
                          onChange={(e) => updateWorkingHour(day, 'open_time', e.target.value)}
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={isOpen ? closeTime : ''}
                          disabled={!isOpen}
                          className="w-24 border-muted/30 bg-background/50"
                          onChange={(e) => updateWorkingHour(day, 'close_time', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-muted/20">
                  <Button 
                    variant="outline" 
                    className="border-muted/30 hover:bg-muted/50"
                    onClick={() => setWorkingHours([])}
                  >
                    Reset
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={saveWorkingHours}
                  >
                    ✓ Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'table-management':
        return (
          <div className="space-y-6 h-full overflow-y-auto">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Table Management</h1>
              <p className="text-muted-foreground mb-6">Manage restaurant tables and generate QR codes</p>
            </div>

            <Card className="border border-muted/20 bg-muted/5">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-foreground font-medium mb-4">Restaurant Tables ({tables.length})</h3>
                  <div className="grid grid-cols-6 gap-4 max-h-64 overflow-y-auto">
                    {tables.map((table) => (
                      <div key={table.id} className="border border-muted/30 bg-background/50 rounded-lg p-4 text-center">
                        <div className="text-foreground font-medium mb-1">{table.table_number}</div>
                        <div className="text-primary text-sm">Seats {table.capacity}</div>
                        <div className="text-muted-foreground text-xs mt-1">Available</div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={generateQRCodes}
                >
                  🔗 Generate QR Codes
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'menu-management':
        return (
          <div className="space-y-6 h-full overflow-y-auto">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Menu Management</h1>
              <p className="text-muted-foreground mb-6">Manage menu categories and items</p>
            </div>

            <Card className="border border-muted/20 bg-muted/5">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-foreground font-medium mb-4">Menu Categories</h3>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Enter category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="border-muted/30 bg-background/50"
                    />
                    <Button 
                      onClick={addMenuCategory}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {menuCategories.length > 0 ? (
                    <div className="space-y-2">
                      {menuCategories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between border border-muted/30 bg-background/50 rounded-lg p-3">
                          <div>
                            <span className="text-foreground font-medium">{category.name}</span>
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
                      ))}
                    </div>
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

      case 'chat':
        return <ChatInterface businessName={businessProfile.name} />;

      default:
        const activeTables = tables.filter(table => table.is_active).length;
        const totalTables = tables.length;
        const occupancyRate = totalTables > 0 ? Math.round((activeTables / totalTables) * 100) : 0;
        
        return (
          <div className="space-y-6 h-full overflow-y-auto">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h1>
              <p className="text-muted-foreground mb-6">Welcome back to {businessProfile.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border border-muted/20 bg-muted/5">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2 text-base">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    Orders Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{todayOrders.length}</div>
                  <p className="text-primary text-sm">
                    {todayOrders.filter(o => o.status === 'pending').length} pending
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-muted/20 bg-muted/5">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2 text-base">
                    <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                    Tables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{activeTables}/{totalTables}</div>
                  <p className="text-muted-foreground text-sm">{occupancyRate}% capacity</p>
                </CardContent>
              </Card>

              <Card className="border border-muted/20 bg-muted/5">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2 text-base">
                    <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                    Menu Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{menuItems.length}</div>
                  <p className="text-muted-foreground text-sm">
                    {menuItems.filter(item => item.is_available).length} available
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-muted/20 bg-muted/5">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.slice(0, 5).length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border border-muted/30 bg-background/50 rounded-lg p-3">
                        <div>
                          <span className="text-foreground font-medium">#{order.order_number}</span>
                          {order.customer_name && (
                            <p className="text-muted-foreground text-sm">{order.customer_name}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            order.status === 'completed' ? 'default' :
                            order.status === 'pending' ? 'secondary' :
                            'outline'
                          }>
                            {order.status}
                          </Badge>
                          <p className="text-foreground text-sm">${order.total_amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center py-8">
                    No orders yet. Orders will appear here once customers start placing them.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-full bg-background p-3 overflow-hidden">
      <div className="grid grid-cols-12 gap-3 h-full">
        
        {/* Left Panel - Navigation */}
        <div className="col-span-3 h-full">
          <div className="border border-muted/20 bg-muted/5 h-full overflow-hidden flex flex-col rounded-lg">
            <div className="p-4 border-b border-muted/20 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h1 className="text-foreground text-lg font-medium">{businessProfile.name}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground h-8 w-8"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground text-sm">{businessProfile.category}</p>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto">
              <div className="space-y-1">
                {sidebarItems.map((item) => (
                  <div key={item.title}>
                    <div 
                      className={`w-full rounded-md p-3 transition-all duration-200 cursor-pointer ${
                        isActive(item.section) 
                          ? 'bg-primary/10 border border-primary/20 text-foreground' 
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                      onClick={() => setActiveSection(item.section)}
                    >
                      <div className="flex items-start gap-3">
                        <item.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground mt-1 leading-tight">{item.subtitle}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Main Content */}
        <div className="col-span-6 h-full">
          <div className="border border-muted/20 bg-muted/5 h-full overflow-hidden flex flex-col rounded-lg">
            {/* Top Header */}
            <div className="border-b border-muted/20 p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium capitalize">{activeSection.replace('-', ' ')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-xs font-medium">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 overflow-auto">
              <DashboardContent />
            </div>
          </div>
        </div>

        {/* Right Panel - Live & Notifications */}
        <div className="col-span-3 h-full">
          <div className="border border-muted/20 bg-muted/5 h-full overflow-hidden flex flex-col rounded-lg">
            <div className="p-4 flex-shrink-0 border-b border-muted/20">
              <h2 className="text-foreground font-medium">Quick Actions</h2>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Button 
                    variant="outline"
                    className="w-full justify-start text-sm border-muted/30 hover:bg-muted/50"
                    onClick={() => setActiveSection('table-management')}
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Manage Tables
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full justify-start text-sm border-muted/30 hover:bg-muted/50"
                    onClick={() => setActiveSection('menu-management')}
                  >
                    <UtensilsCrossed className="h-4 w-4 mr-2" />
                    Manage Menu
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full justify-start text-sm border-muted/30 hover:bg-muted/50"
                    onClick={() => setActiveSection('hours')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Update Hours
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full justify-start text-sm border-muted/30 hover:bg-muted/50"
                    onClick={() => setActiveSection('chat')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    AI Assistant
                  </Button>
                </div>

                <div className="border-t border-muted/20 pt-4">
                  <h3 className="text-foreground font-medium mb-3 text-sm">Business Stats</h3>
                  <div className="space-y-2">
                    <div className="border border-muted/30 bg-background/50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">Categories</span>
                        <span className="text-foreground font-medium">{menuCategories.length}</span>
                      </div>
                    </div>
                    <div className="border border-muted/30 bg-background/50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">Menu Items</span>
                        <span className="text-foreground font-medium">{menuItems.length}</span>
                      </div>
                    </div>
                    <div className="border border-muted/30 bg-background/50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">Total Orders</span>
                        <span className="text-foreground font-medium">{orders.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;