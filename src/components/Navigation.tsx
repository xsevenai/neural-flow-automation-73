import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, CreditCard, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Features", href: "#features", icon: Zap },
    { name: "Pricing", href: "#pricing", icon: CreditCard },
    { name: "About", href: "#about", icon: User },
  ];

  return (
    <nav className="fixed top-0 right-0 z-50 p-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="neural-glass hover:border-primary/50 transition-all duration-300"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </SheetTrigger>
        
        <SheetContent className="neural-glass border-border/50 backdrop-blur-xl">
          <div className="flex flex-col space-y-8 pt-12">
            {/* Navigation Menu */}
            <div className="space-y-4">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-300 group"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="neural-subheading text-lg">{item.name}</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                </motion.a>
              ))}
            </div>

            {/* Auth Buttons */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                variant="outline" 
                className="w-full neural-outline-button"
                onClick={() => {
                  window.location.href = '/auth';
                  setIsOpen(false);
                }}
              >
                Login
              </Button>
              <Button 
                className="w-full neural-button"
                onClick={() => {
                  window.location.href = '/auth#signup';
                  setIsOpen(false);
                }}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="pt-8 border-t border-border/30 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Active Users</span>
                <span className="text-primary font-medium">50K+</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Workflows Automated</span>
                <span className="text-primary font-medium">2M+</span>
              </div>
            </motion.div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navigation;