-- Enable RLS on existing tables that don't have it
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for businesses table
CREATE POLICY "Business owners can view their own business" 
ON public.businesses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Business owners can update their own business" 
ON public.businesses 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own business" 
ON public.businesses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for menu_categories
CREATE POLICY "Business owners can manage their menu categories" 
ON public.menu_categories 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.businesses 
  WHERE businesses.id = menu_categories.business_id 
  AND businesses.user_id = auth.uid()
));

-- Create RLS policies for menu_items
CREATE POLICY "Business owners can manage their menu items" 
ON public.menu_items 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.businesses 
  WHERE businesses.id = menu_items.business_id 
  AND businesses.user_id = auth.uid()
));

-- Fix search path for the function
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;