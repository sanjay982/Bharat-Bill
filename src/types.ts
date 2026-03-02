export interface Product {
  id: string;
  name: string;
  sku: string;
  hsnCode: string;
  price: number;
  stock: number;
  unit: string;
  gstRate: number;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  gstin?: string;
  address: string;
  type: 'customer' | 'vendor';
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
}

export interface Tenant {
  id: string;
  name: string;
  gstin: string;
  email: string;
  phone: string;
  address: string;
  plan: 'free' | 'pro' | 'enterprise';
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
}

export type View = 'dashboard' | 'invoices' | 'inventory' | 'customers' | 'vendors' | 'settings' | 'tenants' | 'billing' | 'plans';
