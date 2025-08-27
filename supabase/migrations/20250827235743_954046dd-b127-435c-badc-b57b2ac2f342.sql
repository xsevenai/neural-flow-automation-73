-- Create profiles table for user authentication
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add user_id to businesses table to link with auth
ALTER TABLE public.businesses 
ADD COLUMN user_id UUID;

-- Create working_hours table
CREATE TABLE public.working_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  day_of_week TEXT NOT NULL,
  open_time TIME,
  close_time TIME,
  is_open BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on working_hours
ALTER TABLE public.working_hours ENABLE ROW LEVEL SECURITY;

-- Create policies for working_hours
CREATE POLICY "Business owners can manage working hours" 
ON public.working_hours 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.businesses 
  WHERE businesses.id = working_hours.business_id 
  AND businesses.user_id = auth.uid()
));

-- Create tables table for restaurant management
CREATE TABLE public.tables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  table_number TEXT NOT NULL,
  seats INTEGER NOT NULL DEFAULT 4,
  qr_code TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tables
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;

-- Create policies for tables
CREATE POLICY "Business owners can manage tables" 
ON public.tables 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.businesses 
  WHERE businesses.id = tables.business_id 
  AND businesses.user_id = auth.uid()
));

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  table_id UUID,
  items JSONB NOT NULL DEFAULT '[]',
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_name TEXT,
  customer_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Business owners can manage orders" 
ON public.orders 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.businesses 
  WHERE businesses.id = orders.business_id 
  AND businesses.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_working_hours_updated_at
  BEFORE UPDATE ON public.working_hours
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tables_updated_at
  BEFORE UPDATE ON public.tables
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();