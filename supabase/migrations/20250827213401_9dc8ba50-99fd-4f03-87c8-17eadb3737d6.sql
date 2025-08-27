-- Create business profiles table
CREATE TABLE public.business_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL DEFAULT 'Restaurant',
  business_email TEXT NOT NULL,
  business_phone TEXT,
  business_address TEXT,
  business_city TEXT,
  business_state TEXT,
  business_country TEXT DEFAULT 'US',
  business_website TEXT,
  company_size TEXT,
  industry_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create working hours table
CREATE TABLE public.working_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun')),
  is_open BOOLEAN NOT NULL DEFAULT true,
  open_time TIME,
  close_time TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id, day_of_week)
);

-- Create menu categories table
CREATE TABLE public.menu_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  prep_time INTEGER, -- in minutes
  allergens TEXT[], -- array of allergen strings
  dietary_tags TEXT[], -- array of dietary tags (vegan, gluten-free, etc.)
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables table for restaurant layout
CREATE TABLE public.restaurant_tables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 4,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  qr_code_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id, table_number)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  table_id UUID REFERENCES public.restaurant_tables(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  order_type TEXT NOT NULL DEFAULT 'dine-in' CHECK (order_type IN ('dine-in', 'takeout', 'delivery')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table for AI assistant
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  response TEXT,
  message_type TEXT NOT NULL DEFAULT 'user' CHECK (message_type IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for business_profiles
CREATE POLICY "Users can view their own business profile" 
ON public.business_profiles 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own business profile" 
ON public.business_profiles 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own business profile" 
ON public.business_profiles 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

-- Create RLS policies for working_hours
CREATE POLICY "Users can manage working hours for their business" 
ON public.working_hours 
FOR ALL 
USING (business_id IN (SELECT id FROM public.business_profiles WHERE user_id::text = auth.uid()::text));

-- Create RLS policies for menu_categories
CREATE POLICY "Users can manage menu categories for their business" 
ON public.menu_categories 
FOR ALL 
USING (business_id IN (SELECT id FROM public.business_profiles WHERE user_id::text = auth.uid()::text));

-- Create RLS policies for menu_items
CREATE POLICY "Users can manage menu items for their business" 
ON public.menu_items 
FOR ALL 
USING (business_id IN (SELECT id FROM public.business_profiles WHERE user_id::text = auth.uid()::text));

-- Create RLS policies for restaurant_tables
CREATE POLICY "Users can manage tables for their business" 
ON public.restaurant_tables 
FOR ALL 
USING (business_id IN (SELECT id FROM public.business_profiles WHERE user_id::text = auth.uid()::text));

-- Create RLS policies for orders
CREATE POLICY "Users can manage orders for their business" 
ON public.orders 
FOR ALL 
USING (business_id IN (SELECT id FROM public.business_profiles WHERE user_id::text = auth.uid()::text));

-- Create RLS policies for order_items
CREATE POLICY "Users can manage order items for their business orders" 
ON public.order_items 
FOR ALL 
USING (order_id IN (SELECT id FROM public.orders WHERE business_id IN (SELECT id FROM public.business_profiles WHERE user_id::text = auth.uid()::text)));

-- Create RLS policies for chat_messages
CREATE POLICY "Users can manage chat messages for their business" 
ON public.chat_messages 
FOR ALL 
USING (business_id IN (SELECT id FROM public.business_profiles WHERE user_id::text = auth.uid()::text));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_business_profiles_updated_at
    BEFORE UPDATE ON public.business_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_working_hours_updated_at
    BEFORE UPDATE ON public.working_hours
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at
    BEFORE UPDATE ON public.menu_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restaurant_tables_updated_at
    BEFORE UPDATE ON public.restaurant_tables
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_business_profiles_user_id ON public.business_profiles(user_id);
CREATE INDEX idx_working_hours_business_id ON public.working_hours(business_id);
CREATE INDEX idx_menu_categories_business_id ON public.menu_categories(business_id);
CREATE INDEX idx_menu_items_business_id ON public.menu_items(business_id);
CREATE INDEX idx_menu_items_category_id ON public.menu_items(category_id);
CREATE INDEX idx_restaurant_tables_business_id ON public.restaurant_tables(business_id);
CREATE INDEX idx_orders_business_id ON public.orders(business_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_chat_messages_business_id ON public.chat_messages(business_id);