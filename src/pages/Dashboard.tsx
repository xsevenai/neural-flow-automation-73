import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, MessageSquare, UtensilsCrossed, Database, LayoutGrid, QrCode, Users, FileText, Clock, BarChart3, Share2, Settings, Bell, MapPin, Calendar, ShoppingCart, MessageCircle, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [workingHours, setWorkingHours] = useState({
    mon: { open: true, start: '09:00', end: '17:00' },
    tue: { open: true, start: '09:00', end: '17:00' },
    wed: { open: true, start: '09:00', end: '17:00' },
    thu: { open: true, start: '09:00', end: '17:00' },
    fri: { open: true, start: '09:00', end: '17:00' },
    sat: { open: false, start: '---', end: '---' },
    sun: { open: false, start: '---', end: '---' }
  });
  const [chatMessage, setChatMessage] = useState('');

  const sidebarItems = [
    { title: "Home", url: "/dashboard", icon: Home, section: "dashboard", subtitle: "Overview and quick actions" },
    { title: "Dashboard Chat", url: "/dashboard/chat", icon: MessageSquare, section: "chat", subtitle: "Conversations with the AI assistant" },
    { title: "Menu", url: "/dashboard/menu", icon: UtensilsCrossed, section: "menu", subtitle: "All items across categories" },
    { title: "Menu Management", url: "/dashboard/menu-management", icon: Database, section: "menu-management", subtitle: "Database, categories, specials, photos, prices" },
    { title: "Table Management", url: "/dashboard/table-management", icon: LayoutGrid, section: "table-management", subtitle: "Layout, statuses, reservations, capacity" },
    { title: "QR Code Assets", url: "/dashboard/qr", icon: QrCode, section: "qr", subtitle: "Templates, logo integration, batches" },
    { title: "Customer Data", url: "/dashboard/customers", icon: Users, section: "customers", subtitle: "Lists, loyalty, segments, feedback" },
    { title: "Operational Files", url: "/dashboard/files", icon: FileText, section: "files", subtitle: "Reports, schedules, inventory, permits" },
    { title: "Working Hours", url: "/dashboard/hours", icon: Clock, section: "hours", subtitle: "Open/close times, breaks, special days" }
  ];

  const isActive = (section: string) => activeSection === section;

  const DashboardContent = () => {
    switch (activeSection) {
      case 'hours':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Working Hours</h1>
              <p className="text-slate-400 mb-6">Configure weekly open/close times</p>
              <p className="text-slate-300 text-sm mb-6">Times are in 24h format</p>
            </div>

            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Object.entries(workingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between py-3">
                      <div className="w-12">
                        <span className="text-white font-medium capitalize">{day}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={hours.open}
                          onCheckedChange={(checked) => {
                            setWorkingHours(prev => ({
                              ...prev,
                              [day]: { 
                                ...prev[day], 
                                open: checked,
                                start: checked ? '09:00' : '---',
                                end: checked ? '17:00' : '---'
                              }
                            }));
                          }}
                          className="data-[state=checked]:bg-emerald-600"
                        />
                        <span className="text-slate-300 w-12 text-sm">
                          {hours.open ? 'Open' : 'Open'}
                        </span>
                        <Input
                          type="time"
                          value={hours.open ? hours.start : ''}
                          disabled={!hours.open}
                          className="w-24 bg-slate-600 border-slate-500 text-white"
                          onChange={(e) => {
                            setWorkingHours(prev => ({
                              ...prev,
                              [day]: { ...prev[day], start: e.target.value }
                            }));
                          }}
                        />
                        <span className="text-slate-400">to</span>
                        <Input
                          type="time"
                          value={hours.open ? hours.end : ''}
                          disabled={!hours.open}
                          className="w-24 bg-slate-600 border-slate-500 text-white"
                          onChange={(e) => {
                            setWorkingHours(prev => ({
                              ...prev,
                              [day]: { ...prev[day], end: e.target.value }
                            }));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-600">
                  <Button variant="outline" className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500">
                    Reset
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    ✓ Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'table-management':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Table Layout</h1>
              <p className="text-slate-400 mb-6">Visualize table occupancy and manage reservations</p>
            </div>

            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-6">
                <div className="grid grid-cols-6 gap-4 mb-6">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="bg-slate-600 rounded-lg p-4 text-center border border-slate-500">
                      <div className="text-white font-medium mb-1">T{i + 1}</div>
                      <div className="text-emerald-400 text-sm">available</div>
                    </div>
                  ))}
                </div>
                <Button className="bg-slate-600 border border-slate-500 text-white hover:bg-slate-500">
                  🔗 Generate Table QR
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'menu-management':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Menu Items Database</h1>
              <p className="text-slate-400 mb-6">Browse by category and manage pricing, availability</p>
            </div>

            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-6">
                <Button className="bg-slate-600 border border-slate-500 text-white hover:bg-slate-500 mb-4">
                  + Add Category
                </Button>
                <div className="text-slate-300">No categories added yet. Click "Add Category" to get started.</div>
              </CardContent>
            </Card>
          </div>
        );

      case 'chat':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Dashboard AI</h1>
              <p className="text-slate-400 mb-6">Business Owners Chatting</p>
            </div>

            <Card className="bg-slate-700 border-slate-600 h-96">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="flex-1 p-6">
                  <div className="text-slate-300 text-center">Start a conversation with your AI assistant</div>
                </div>
                <div className="p-4 border-t border-slate-600">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type a message"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="bg-slate-600 border-slate-500 text-white resize-none"
                      rows={1}
                    />
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => setChatMessage('')}
                    >
                      ➤
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-slate-400 mb-6">Overview and quick actions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-emerald-400" />
                    Orders Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">247</div>
                  <p className="text-emerald-400 text-sm">+12% from yesterday</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    Active Tables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">8/12</div>
                  <p className="text-blue-400 text-sm">67% occupancy</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-yellow-400" />
                    Live Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">3</div>
                  <p className="text-yellow-400 text-sm">Active conversations</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-slate-900 p-4">
        <div className="grid grid-cols-12 gap-4 h-screen">
          
          {/* Left Panel - Navigation */}
          <div className="col-span-3">
            <div className="bg-slate-800 rounded-xl border border-slate-700 h-full overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <h1 className="text-white text-xl font-semibold">naveen</h1>
              </div>
              
              <div className="p-3 h-full overflow-y-auto">
                <div className="space-y-2">
                  {sidebarItems.map((item) => (
                    <div key={item.title} className="mb-2">
                      <div 
                        className={`w-full rounded-lg p-3 transition-all duration-200 cursor-pointer ${
                          isActive(item.section) 
                            ? 'bg-slate-700 text-white border border-slate-600' 
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                        onClick={() => setActiveSection(item.section)}
                      >
                        <div className="flex items-start gap-3">
                          <item.icon className={`h-5 w-5 mt-0.5 ${
                            item.section === 'dashboard' ? 'text-emerald-400' :
                            item.section === 'chat' ? 'text-cyan-400' :
                            item.section === 'menu' ? 'text-yellow-400' :
                            item.section === 'menu-management' ? 'text-emerald-400' :
                            item.section === 'table-management' ? 'text-blue-400' :
                            item.section === 'qr' ? 'text-purple-400' :
                            item.section === 'customers' ? 'text-teal-400' :
                            item.section === 'files' ? 'text-green-400' :
                            'text-yellow-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{item.title}</div>
                            <div className="text-xs text-slate-400 mt-1 leading-tight">{item.subtitle}</div>
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
          <div className="col-span-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 h-full overflow-hidden flex flex-col">
              {/* Top Header */}
              <div className="bg-slate-800 border-b border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-white font-medium capitalize">{activeSection.replace('-', ' ')}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                      <BarChart3 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" className="text-slate-300 hover:text-white">
                      <Share2 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                    <Button variant="ghost" className="text-slate-300 hover:text-white">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                      <Settings className="h-5 w-5" />
                    </Button>
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">N</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6 overflow-auto">
                <DashboardContent />
              </div>
            </div>
          </div>

          {/* Right Panel - Live & Notifications */}
          <div className="col-span-3">
            <div className="bg-slate-800 rounded-xl border border-slate-700 h-full overflow-hidden">
              <div className="p-6 h-full overflow-y-auto">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-white font-medium">Live</h2>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button className="w-full bg-slate-700 border border-slate-600 text-white hover:bg-slate-600 justify-start">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Live Orders
                    </Button>
                    <Button className="w-full bg-slate-700 border border-slate-600 text-white hover:bg-slate-600 justify-start">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Live Chat
                    </Button>
                    <Button className="w-full bg-slate-700 border border-slate-600 text-white hover:bg-slate-600 justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Live Reservation
                    </Button>
                    <Button className="w-full bg-slate-700 border border-slate-600 text-white hover:bg-slate-600 justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Reports
                    </Button>
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <h3 className="text-white font-medium mb-4">Notification</h3>
                    <div className="space-y-3">
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <Bell className="h-4 w-4 text-emerald-400 mt-0.5" />
                          <div>
                            <p className="text-white text-sm font-medium">New online order received</p>
                            <p className="text-slate-400 text-xs">2 min ago • Order #1024</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-yellow-400 mt-0.5" />
                          <div>
                            <p className="text-white text-sm font-medium">Reservation starting soon</p>
                            <p className="text-slate-400 text-xs">Today 18:30 • Party of 4</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-orange-400 mt-0.5" />
                          <div>
                            <p className="text-white text-sm font-medium">Low stock: Fresh basil</p>
                            <p className="text-slate-400 text-xs">Reorder suggested</p>
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
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;