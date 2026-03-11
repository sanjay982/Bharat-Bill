export interface Product {
  id: string;
  name: string;
  sku: string;
  hsnCode: string;
  price: number;
  stock: number;
  unit: string;
  gstRate: number;
  tenantId?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  gstin?: string;
  address: string;
  type: 'customer' | 'vendor';
  customerType?: 'b2b' | 'b2c';
  tenantId?: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  name: string;
  hsnCode: string;
  quantity: number;
  price: number;
  gstRate: number;
  amount: number;
  gstAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  contactId: string;
  tenantId: string;
  items: InvoiceItem[];
  subtotal: number;
  totalGst: number;
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  notes?: string;
  type: 'sale' | 'purchase';
  invoiceType?: 'b2b' | 'b2c';
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  date: string;
  validUntil: string;
  contactId: string;
  tenantId: string;
  items: InvoiceItem[];
  subtotal: number;
  totalGst: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'converted';
  notes?: string;
}

export interface Tenant {
  id: string;
  name: string;
  gstin: string;
  email: string;
  phone: string;
  address: string;
  plan: 'standard' | 'pro' | 'enterprise';
  status: 'active' | 'inactive';
  billingCycle?: 'monthly' | 'yearly';
  nextBillingDate?: string;
  amount?: number;
  invoicePrefix?: string;
  invoiceStartingNumber?: number;
  logoUrl?: string;
}

export interface AppConfig {
  primaryColor: string;
  logoUrl: string;
  appName: string;
  currency: string;
  landingPage?: LandingPageConfig;
  loginAd?: LoginAdConfig;
}

export interface LandingPageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  features: { title: string; description: string; icon: string }[];
}

export interface LoginAdConfig {
  enabled: boolean;
  imageUrl: string;
  youtubeUrl?: string;
  link?: string;
  title?: string;
  description?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  view?: View;
}

export type View = 'dashboard' | 'invoices' | 'quotations' | 'inventory' | 'customers' | 'vendors' | 'settings' | 'tenants' | 'billing' | 'plans' | 'notifications' | 'reports' | 'cms';
