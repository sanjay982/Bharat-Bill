-- SQL Script to create tables in Supabase
-- Copy and paste this into the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sku TEXT,
  hsn_code TEXT,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT,
  gst_rate INTEGER NOT NULL DEFAULT 0,
  user_id UUID REFERENCES auth.users(id),
  tenant_id TEXT NOT NULL DEFAULT '1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  gstin TEXT,
  address TEXT,
  type TEXT CHECK (type IN ('customer', 'vendor')),
  customer_type TEXT CHECK (customer_type IN ('b2b', 'b2c')),
  user_id UUID REFERENCES auth.users(id),
  tenant_id TEXT NOT NULL DEFAULT '1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL,
  date DATE NOT NULL,
  due_date DATE NOT NULL,
  contact_id UUID REFERENCES contacts(id),
  subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_gst DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  status TEXT CHECK (status IN ('paid', 'unpaid', 'overdue')),
  notes TEXT,
  type TEXT CHECK (type IN ('sale', 'purchase')),
  invoice_type TEXT CHECK (invoice_type IN ('b2b', 'b2c')),
  user_id UUID REFERENCES auth.users(id),
  tenant_id TEXT NOT NULL DEFAULT '1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Invoice Items Table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  name TEXT NOT NULL,
  hsn_code TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  gst_rate INTEGER NOT NULL DEFAULT 0,
  amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  gst_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tenant_id TEXT NOT NULL DEFAULT '1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  business TEXT NOT NULL,
  mobile TEXT NOT NULL,
  comments TEXT,
  user_id UUID REFERENCES auth.users(id),
  tenant_id TEXT NOT NULL DEFAULT '1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add tenant_id to existing tables if they were created before
ALTER TABLE products ADD COLUMN IF NOT EXISTS tenant_id TEXT NOT NULL DEFAULT '1';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS tenant_id TEXT NOT NULL DEFAULT '1';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tenant_id TEXT NOT NULL DEFAULT '1';
ALTER TABLE invoice_items ADD COLUMN IF NOT EXISTS tenant_id TEXT NOT NULL DEFAULT '1';
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS tenant_id TEXT NOT NULL DEFAULT '1';

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can manage their own products" ON products;
DROP POLICY IF EXISTS "Users can manage their own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can manage their own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can manage their own invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Users can insert feedback" ON feedback;
DROP POLICY IF EXISTS "Admins can view all feedback" ON feedback;

DROP POLICY IF EXISTS "Users can manage their tenant's products" ON products;
DROP POLICY IF EXISTS "Users can manage their tenant's contacts" ON contacts;
DROP POLICY IF EXISTS "Users can manage their tenant's invoices" ON invoices;
DROP POLICY IF EXISTS "Users can manage their tenant's invoice items" ON invoice_items;

-- Create Policies
CREATE POLICY "Users can manage their tenant's products" ON products FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'tenant_id') = tenant_id OR auth.jwt() ->> 'email' = 'sanju13july@gmail.com'
);
CREATE POLICY "Users can manage their tenant's contacts" ON contacts FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'tenant_id') = tenant_id OR auth.jwt() ->> 'email' = 'sanju13july@gmail.com'
);
CREATE POLICY "Users can manage their tenant's invoices" ON invoices FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'tenant_id') = tenant_id OR auth.jwt() ->> 'email' = 'sanju13july@gmail.com'
);
CREATE POLICY "Users can manage their tenant's invoice items" ON invoice_items FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'tenant_id') = tenant_id OR auth.jwt() ->> 'email' = 'sanju13july@gmail.com'
);
CREATE POLICY "Users can insert feedback" ON feedback FOR INSERT WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'tenant_id') = tenant_id OR auth.jwt() ->> 'email' = 'sanju13july@gmail.com'
);
CREATE POLICY "Admins can view all feedback" ON feedback FOR SELECT USING (auth.jwt() ->> 'email' = 'sanju13july@gmail.com');

-- Create Workspace Users Table
CREATE TABLE IF NOT EXISTS workspace_users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE workspace_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view workspace users in their tenant" ON workspace_users;
DROP POLICY IF EXISTS "Admins can manage workspace users in their tenant" ON workspace_users;

CREATE POLICY "Users can view workspace users in their tenant" ON workspace_users
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'tenant_id') = tenant_id OR auth.jwt() ->> 'email' = 'sanju13july@gmail.com'
  );

CREATE POLICY "Admins can manage workspace users in their tenant" ON workspace_users
  FOR ALL USING (
    (
      (auth.jwt() -> 'user_metadata' ->> 'tenant_id') = tenant_id
      AND
      (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    ) OR auth.jwt() ->> 'email' = 'sanju13july@gmail.com'
  );
