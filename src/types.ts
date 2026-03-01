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
  items: InvoiceItem[];
  subtotal: number;
  totalGst: number;
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  notes?: string;
  type: 'sale' | 'purchase';
}

export type View = 'dashboard' | 'invoices' | 'inventory' | 'customers' | 'vendors' | 'settings';
