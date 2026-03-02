import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  User,
  LogOut,
  Menu,
  X,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  ShoppingCart,
  IndianRupee,
  Download,
  Printer,
  Trash2,
  Edit2,
  ChevronRight,
  Filter,
  Building2,
  ShieldCheck,
  Globe,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import { Product, Contact, Invoice, View, InvoiceItem, Tenant, AppConfig, Notification } from './types';
import { cn, formatCurrency, calculateGST } from './utils';

// Mock Data
const MOCK_TENANTS: Tenant[] = [
  { id: '1', name: 'BharatBill Solutions', gstin: '27ABCDE1234F1Z5', email: 'contact@bharatbill.com', phone: '+91 98765 43210', address: 'Mumbai', plan: 'enterprise', status: 'active', billingCycle: 'yearly', nextBillingDate: '2025-01-01', amount: 15000 },
  { id: '2', name: 'South India Retail', gstin: '33FGHIJ5678K2Z6', email: 'billing@southretail.com', phone: '+91 88888 77777', address: 'Chennai', plan: 'pro', status: 'active', billingCycle: 'monthly', nextBillingDate: '2024-04-01', amount: 1200 },
  { id: '3', name: 'North Logistics', gstin: '07KLMNO9012P3Z7', email: 'ops@northlog.com', phone: '+91 77777 66666', address: 'Delhi', plan: 'free', status: 'inactive' },
];

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Laptop', sku: 'LAP-001', hsnCode: '8471', price: 45000, stock: 15, unit: 'pcs', gstRate: 18 },
  { id: '2', name: 'Wireless Mouse', sku: 'MOU-002', hsnCode: '8471', price: 1200, stock: 50, unit: 'pcs', gstRate: 12 },
  { id: '3', name: 'Office Chair', sku: 'CHR-003', hsnCode: '9403', price: 8500, stock: 8, unit: 'pcs', gstRate: 18 },
  { id: '4', name: 'LED Monitor', sku: 'MON-004', hsnCode: '8528', price: 12000, stock: 12, unit: 'pcs', gstRate: 18 },
];

const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Acme Corp', email: 'billing@acme.com', phone: '9876543210', gstin: '27AAAAA0000A1Z5', address: 'Mumbai, Maharashtra', type: 'customer' },
  { id: '2', name: 'Tech Solutions', email: 'sales@techsol.com', phone: '9123456780', gstin: '29BBBBB1111B2Z6', address: 'Bangalore, Karnataka', type: 'customer' },
  { id: '3', name: 'Global Suppliers', email: 'info@globalsupplies.com', phone: '9000000001', address: 'Delhi, NCR', type: 'vendor' },
];

const MOCK_INVOICES: Invoice[] = [
  { 
    id: '1', 
    invoiceNumber: 'INV-2024-001', 
    date: '2024-03-01', 
    dueDate: '2024-03-15', 
    contactId: '1', 
    tenantId: '1',
    items: [
      { id: '1', productId: '1', name: 'Premium Laptop', hsnCode: '8471', quantity: 1, price: 45000, gstRate: 18, amount: 45000, gstAmount: 8100 }
    ],
    subtotal: 45000,
    totalGst: 8100,
    totalAmount: 53100,
    status: 'paid',
    type: 'sale'
  },
  { 
    id: '2', 
    invoiceNumber: 'INV-2024-002', 
    date: '2024-03-02', 
    dueDate: '2024-03-16', 
    contactId: '2', 
    tenantId: '1',
    items: [
      { id: '2', productId: '2', name: 'Wireless Mouse', hsnCode: '8471', quantity: 5, price: 1200, gstRate: 12, amount: 6000, gstAmount: 720 }
    ],
    subtotal: 6000,
    totalGst: 720,
    totalAmount: 6720,
    status: 'unpaid',
    type: 'sale'
  }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Low Stock Alert', message: 'Premium Laptop stock is below 10 units.', time: '2 hours ago', read: false, type: 'warning', view: 'inventory' },
  { id: '2', title: 'Payment Received', message: 'Invoice INV-2024-001 has been paid.', time: '5 hours ago', read: true, type: 'success', view: 'invoices' },
  { id: '3', title: 'New Customer', message: 'Acme Corp added to your contact list.', time: '1 day ago', read: false, type: 'info', view: 'customers' },
  { id: '4', title: 'System Update', message: 'BharatBill v2.1 is now live with new features.', time: '2 days ago', read: true, type: 'info' },
];

const CHART_DATA = [
  { name: 'Jan', sales: 45000, expenses: 32000 },
  { name: 'Feb', sales: 52000, expenses: 38000 },
  { name: 'Mar', sales: 61000, expenses: 41000 },
  { name: 'Apr', sales: 58000, expenses: 45000 },
  { name: 'May', sales: 72000, expenses: 48000 },
  { name: 'Jun', sales: 85000, expenses: 52000 },
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [billingDuration, setBillingDuration] = useState<'monthly' | 'quarterly' | 'half-yearly' | 'yearly'>('monthly');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeTenantId, setActiveTenantId] = useState('1');
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [appConfig, setAppConfig] = useState<AppConfig>({
    primaryColor: '#10b981',
    logoUrl: '',
    appName: 'BharatBill',
    currency: 'INR'
  });
  const [businessProfile, setBusinessProfile] = useState({
    name: 'BharatBill Solutions',
    gstin: '27ABCDE1234F1Z5',
    email: 'contact@bharatbill.com',
    phone: '+91 98765 43210',
    address: '123 Business Park, Mumbai, Maharashtra, 400001',
    logo: ''
  });

  const generatePDF = (invoice: Invoice, action: 'download' | 'print' = 'download') => {
    const doc = new jsPDF();
    const contact = contacts.find(c => c.id === invoice.contactId);
    
    // Header
    doc.setFontSize(20);
    doc.text('TAX INVOICE', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(businessProfile.name, 20, 40);
    doc.text(`GSTIN: ${businessProfile.gstin}`, 20, 45);
    doc.text(businessProfile.address, 20, 50);
    
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 140, 40);
    doc.text(`Date: ${format(new Date(invoice.date), 'dd/MM/yyyy')}`, 140, 45);
    doc.text(`Due Date: ${format(new Date(invoice.dueDate), 'dd/MM/yyyy')}`, 140, 50);
    
    // Bill To
    doc.setFontSize(12);
    doc.text('Bill To:', 20, 70);
    doc.setFontSize(10);
    doc.text(contact?.name || 'Customer Name', 20, 75);
    doc.text(contact?.address || 'Address', 20, 80);
    doc.text(`GSTIN: ${contact?.gstin || 'N/A'}`, 20, 85);
    
    // Table
    const tableData = invoice.items.map(item => [
      item.name,
      item.hsnCode,
      item.quantity,
      formatCurrency(item.price),
      `${item.gstRate}%`,
      formatCurrency(item.gstAmount),
      formatCurrency(item.amount + item.gstAmount)
    ]);
    
    autoTable(doc, {
      startY: 100,
      head: [['Product', 'HSN', 'Qty', 'Price', 'GST %', 'GST Amt', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    
    // Totals
    doc.text(`Subtotal: ${formatCurrency(invoice.subtotal)}`, 140, finalY + 10);
    doc.text(`Total GST: ${formatCurrency(invoice.totalGst)}`, 140, finalY + 15);
    doc.setFontSize(12);
    doc.text(`Grand Total: ${formatCurrency(invoice.totalAmount)}`, 140, finalY + 25);
    
    if (action === 'print') {
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    } else {
      doc.save(`${invoice.invoiceNumber}.pdf`);
    }
  };

  const deleteInvoice = (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(inv => inv.id !== id));
      showToast('Invoice deleted successfully');
    }
  };

  const markNotificationAsRead = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    
    if (notification?.view) {
      setCurrentView(notification.view);
      setIsNotificationsOpen(false);
    }
  };

  const addNotification = (title: string, message: string, type: Notification['type'] = 'info', view?: View) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      time: 'Just now',
      read: false,
      type,
      view
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setIsNotificationsOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderCustomers = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 md:p-6 border-bottom border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Customers</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 w-full md:w-64"
            />
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-y border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">GSTIN</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contacts.filter(c => c.type === 'customer').map(customer => (
              <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-xs font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{customer.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">{customer.email}</p>
                  <p className="text-xs text-slate-400">{customer.phone}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-mono">{customer.gstin || 'Unregistered'}</td>
                <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{customer.address}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-danger transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Stats
  const totalSales = invoices.filter(i => i.type === 'sale').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalReceivables = invoices.filter(i => i.type === 'sale' && i.status === 'unpaid').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sales" value={formatCurrency(totalSales)} icon={<IndianRupee className="w-5 h-5" />} trend="+12.5%" trendType="up" />
        <StatCard title="Receivables" value={formatCurrency(totalReceivables)} icon={<CreditCard className="w-5 h-5" />} trend="-2.4%" trendType="down" />
        <StatCard title="Low Stock Items" value={lowStockCount.toString()} icon={<Package className="w-5 h-5" />} trend="Critical" trendType="down" />
        <StatCard title="Active Customers" value={contacts.filter(c => c.type === 'customer').length.toString()} icon={<Users className="w-5 h-5" />} trend="+5 new" trendType="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Revenue Overview</h3>
            <select className="bg-slate-50 border-none text-sm rounded-lg focus:ring-0">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {invoices.slice(0, 5).map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    invoice.status === 'paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-slate-500">{format(new Date(invoice.date), 'dd MMM yyyy')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(invoice.totalAmount)}</p>
                  <p className={cn(
                    "text-[10px] uppercase tracking-wider font-bold",
                    invoice.status === 'paid' ? "text-emerald-600" : "text-amber-600"
                  )}>{invoice.status}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setCurrentView('invoices')}
            className="w-full mt-6 py-2 text-sm text-slate-500 hover:text-primary font-medium flex items-center justify-center gap-1"
          >
            View All Invoices <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 md:p-6 border-bottom border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Invoices</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => setIsNewInvoiceModalOpen(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-y border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice #</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map(invoice => (
              <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{invoice.invoiceNumber}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {contacts.find(c => c.id === invoice.contactId)?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{format(new Date(invoice.date), 'dd MMM yyyy')}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(invoice.totalAmount)}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    invoice.status === 'paid' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  )}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => generatePDF(invoice, 'print')}
                      className="p-2 text-slate-400 hover:text-primary transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => generatePDF(invoice, 'download')}
                      className="p-2 text-slate-400 hover:text-primary transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteInvoice(invoice.id)}
                      className="p-2 text-slate-400 hover:text-danger transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTenants = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Tenant Management</h2>
          <p className="text-sm text-slate-500">Manage multi-industry business accounts</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button 
            onClick={() => setCurrentView('billing')}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1"
          >
            <CreditCard className="w-4 h-4" /> Billing Overview
          </button>
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tenants..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 w-full md:w-64"
            />
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
            <Plus className="w-4 h-4" /> New Tenant
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-y border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">GSTIN</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map(tenant => (
              <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{tenant.name}</p>
                      <p className="text-xs text-slate-500">{tenant.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    tenant.plan === 'enterprise' ? "bg-indigo-50 text-indigo-700" : 
                    tenant.plan === 'pro' ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
                  )}>
                    {tenant.plan}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-mono">{tenant.gstin}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      tenant.status === 'active' ? "bg-emerald-500" : "bg-slate-300"
                    )} />
                    <span className="text-sm text-slate-600 capitalize">{tenant.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setActiveTenantId(tenant.id)}
                      className={cn(
                        "text-xs font-bold px-3 py-1.5 rounded-lg transition-all",
                        activeTenantId === tenant.id ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {activeTenantId === tenant.id ? 'Active' : 'Switch'}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Monthly Revenue" 
          value={formatCurrency(125000)} 
          icon={<TrendingUp className="w-5 h-5" />} 
          trend="+12.5%" 
          trendType="up" 
        />
        <StatCard 
          title="Active Subscriptions" 
          value="42" 
          icon={<Users className="w-5 h-5" />} 
          trend="+3" 
          trendType="up" 
        />
        <StatCard 
          title="Pending Renewals" 
          value="5" 
          icon={<Bell className="w-5 h-5" />} 
          trend="-2" 
          trendType="down" 
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Tenant Billing Plans</h2>
          <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">View All Invoices</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-y border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cycle</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Billing</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map(tenant => (
                <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{tenant.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      tenant.plan === 'enterprise' ? "bg-indigo-50 text-indigo-700" : 
                      tenant.plan === 'pro' ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
                    )}>
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 capitalize">{tenant.billingCycle || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{tenant.nextBillingDate || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{tenant.amount ? formatCurrency(tenant.amount) : '-'}</td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-bold text-emerald-600 hover:underline">Manage Plan</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 md:p-6 border-bottom border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Inventory</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 w-full md:w-64"
            />
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-y border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">HSN</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">GST</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{product.hsnCode}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      product.stock > 20 ? "bg-emerald-500" : product.stock > 10 ? "bg-amber-500" : "bg-rose-500"
                    )} />
                    <span className="text-sm text-slate-600">{product.stock} {product.unit}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(product.price)}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{product.gstRate}%</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-danger transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-slate-500">Manage your business profile and application settings</p>
        </div>
        
        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Business Profile Section */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Business Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">Business Name</label>
                    <input 
                      type="text" 
                      value={businessProfile.name}
                      onChange={(e) => setBusinessProfile({...businessProfile, name: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">GSTIN</label>
                    <input 
                      type="text" 
                      value={businessProfile.gstin}
                      onChange={(e) => setBusinessProfile({...businessProfile, gstin: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">Email Address</label>
                    <input 
                      type="email" 
                      value={businessProfile.email}
                      onChange={(e) => setBusinessProfile({...businessProfile, email: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">Phone Number</label>
                    <input 
                      type="text" 
                      value={businessProfile.phone}
                      onChange={(e) => setBusinessProfile({...businessProfile, phone: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-semibold text-slate-600">Business Address</label>
                    <textarea 
                      rows={3}
                      value={businessProfile.address}
                      onChange={(e) => setBusinessProfile({...businessProfile, address: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Invoice Customization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">Invoice Prefix</label>
                    <input 
                      type="text" 
                      placeholder="INV"
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">Starting Number</label>
                    <input 
                      type="number" 
                      placeholder="1001"
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">App Customization (Admin)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">App Name</label>
                    <input 
                      type="text" 
                      value={appConfig.appName}
                      onChange={(e) => setAppConfig({...appConfig, appName: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">Primary Theme Color</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={appConfig.primaryColor}
                        onChange={(e) => setAppConfig({...appConfig, primaryColor: e.target.value})}
                        className="w-12 h-12 rounded-xl border-none p-1 bg-slate-50 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={appConfig.primaryColor}
                        onChange={(e) => setAppConfig({...appConfig, primaryColor: e.target.value})}
                        className="flex-1 bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-mono uppercase"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">Logo URL</label>
                    <input 
                      type="text" 
                      value={appConfig.logoUrl}
                      onChange={(e) => setAppConfig({...appConfig, logoUrl: e.target.value})}
                      placeholder="https://example.com/logo.png"
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">Default Currency</label>
                    <select 
                      value={appConfig.currency}
                      onChange={(e) => setAppConfig({...appConfig, currency: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Side Actions Section */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">System Status</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-emerald-700">GST API Connected</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Active</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-slate-400 rounded-full" />
                      <span className="text-sm font-medium text-slate-600">Last Backup</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">2h ago</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                      <span className="text-sm font-medium text-slate-700">Export All Data</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                      <span className="text-sm font-medium text-slate-700">Manage Team</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                  <button 
                    onClick={() => setCurrentView('tenants')}
                    className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                      <span className="text-sm font-medium text-slate-700">Manage Tenants</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-2xl hover:bg-rose-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-5 h-5 text-rose-400" />
                      <span className="text-sm font-medium text-rose-700">Reset System</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(1542000)} 
          icon={<TrendingUp className="w-5 h-5" />} 
          trend="+18.2%" 
          trendType="up" 
        />
        <StatCard 
          title="Total GST Collected" 
          value={formatCurrency(277560)} 
          icon={<ShieldCheck className="w-5 h-5" />} 
          trend="+15.4%" 
          trendType="up" 
        />
        <StatCard 
          title="Outstanding Amount" 
          value={formatCurrency(85400)} 
          icon={<AlertTriangle className="w-5 h-5" />} 
          trend="-5.2%" 
          trendType="down" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Sales by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Electronics', value: 45 },
                    { name: 'Furniture', value: 25 },
                    { name: 'Services', value: 20 },
                    { name: 'Other', value: 10 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[ '#10b981', '#3b82f6', '#f59e0b', '#ef4444' ].map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-600">Electronics (45%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-slate-600">Furniture (25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm text-slate-600">Services (20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-sm text-slate-600">Other (10%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Monthly GST Report</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Available Reports</h3>
          <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Export All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { name: 'GSTR-1 Summary', description: 'Monthly outward supplies report for GST filing', type: 'GST' },
            { name: 'GSTR-3B Details', description: 'Self-assessment monthly return summary', type: 'GST' },
            { name: 'Profit & Loss Statement', description: 'Comprehensive financial performance overview', type: 'Finance' },
            { name: 'Inventory Valuation', description: 'Current stock value and turnover ratio', type: 'Inventory' },
            { name: 'Customer Aging Report', description: 'Outstanding payments grouped by duration', type: 'Receivables' }
          ].map((report, i) => (
            <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{report.name}</p>
                  <p className="text-xs text-slate-500">{report.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-500 rounded-md">{report.type}</span>
                <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlans = () => {
    const plans = [
      {
        name: 'Free',
        price: 0,
        description: 'Perfect for small businesses starting out.',
        features: ['Up to 50 invoices/month', 'Basic inventory', 'Single user', 'Standard support'],
        buttonText: 'Current Plan',
        isCurrent: true,
        color: 'slate'
      },
      {
        name: 'Pro',
        price: billingDuration === 'monthly' ? 1999 : 
               billingDuration === 'quarterly' ? 5499 : 
               billingDuration === 'half-yearly' ? 9999 : 17999,
        description: 'Advanced features for growing businesses.',
        features: ['Unlimited invoices', 'Advanced inventory', 'Up to 5 users', 'Priority support', 'GST reports'],
        buttonText: 'Upgrade to Pro',
        isCurrent: false,
        color: 'emerald',
        popular: true
      },
      {
        name: 'Enterprise',
        price: billingDuration === 'monthly' ? 4999 : 
               billingDuration === 'quarterly' ? 13999 : 
               billingDuration === 'half-yearly' ? 24999 : 44999,
        description: 'Custom solutions for large enterprises.',
        features: ['Everything in Pro', 'Multi-tenant support', 'Unlimited users', 'Dedicated account manager', 'Custom API access'],
        buttonText: 'Contact Sales',
        isCurrent: false,
        color: 'indigo'
      }
    ];

    const getDurationLabel = () => {
      switch(billingDuration) {
        case 'monthly': return '/ month';
        case 'quarterly': return '/ quarter';
        case 'half-yearly': return '/ 6 months';
        case 'yearly': return '/ year';
      }
    };

    const getSavingsLabel = () => {
      switch(billingDuration) {
        case 'monthly': return null;
        case 'quarterly': return 'Save 8%';
        case 'half-yearly': return 'Save 16%';
        case 'yearly': return 'Save 25%';
      }
    };

    return (
      <div className="space-y-8 max-w-6xl mx-auto py-4">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Choose the right plan for your business</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Scale your billing operations with BharatBill. Choose a plan that fits your current needs and upgrade as you grow.
          </p>
          
          <div className="flex justify-center pt-4">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
              {(['monthly', 'quarterly', 'half-yearly', 'yearly'] as const).map((duration) => (
                <button
                  key={duration}
                  onClick={() => setBillingDuration(duration)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize",
                    billingDuration === duration 
                      ? "bg-white text-emerald-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>
          {getSavingsLabel() && (
            <p className="text-emerald-600 text-xs font-bold animate-bounce">
              {getSavingsLabel()} with {billingDuration} billing!
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={cn(
                "relative bg-white rounded-3xl border p-8 flex flex-col h-full transition-all hover:shadow-xl hover:-translate-y-1",
                plan.popular ? "border-emerald-500 shadow-lg ring-1 ring-emerald-500/20" : "border-slate-100"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">{formatCurrency(plan.price)}</span>
                  <span className="text-slate-400 text-sm font-medium">{getDurationLabel()}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">What's included:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                      <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={cn(
                  "w-full py-4 rounded-2xl text-sm font-bold transition-all",
                  plan.isCurrent 
                    ? "bg-slate-100 text-slate-500 cursor-default" 
                    : plan.color === 'emerald' 
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200" 
                      : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200"
                )}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg font-bold text-slate-900">Need a custom plan?</h4>
            <p className="text-sm text-slate-500">We offer specialized pricing for high-volume businesses and government organizations.</p>
          </div>
          <button className="bg-white text-slate-900 border border-slate-200 px-8 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
            Talk to an Expert
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-50 relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "bg-primary text-white transition-all duration-300 flex flex-col fixed h-full z-[70] lg:z-50",
        isSidebarOpen ? "w-64" : "w-20",
        "lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: appConfig.primaryColor }}>
              {appConfig.logoUrl ? (
                <img src={appConfig.logoUrl} alt="Logo" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
              ) : (
                <IndianRupee className="w-5 h-5 text-white" />
              )}
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && <h1 className="text-xl font-bold tracking-tight">{appConfig.appName}</h1>}
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          <NavItem icon={<FileText />} label="Invoices" active={currentView === 'invoices'} onClick={() => { setCurrentView('invoices'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          <NavItem icon={<Package />} label="Inventory" active={currentView === 'inventory'} onClick={() => { setCurrentView('inventory'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          <NavItem icon={<Users />} label="Customers" active={currentView === 'customers'} onClick={() => { setCurrentView('customers'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          <NavItem icon={<Building2 />} label="Tenants" active={currentView === 'tenants'} onClick={() => { setCurrentView('tenants'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          <NavItem icon={<BarChart3 />} label="Reports" active={currentView === 'reports'} onClick={() => { setCurrentView('reports'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          <NavItem icon={<CreditCard />} label="Plans" active={currentView === 'plans'} onClick={() => { setCurrentView('plans'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          <NavItem icon={<CreditCard />} label="Billing" active={currentView === 'billing'} onClick={() => { setCurrentView('billing'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          <NavItem icon={<ShoppingCart />} label="Purchases" active={false} onClick={() => {}} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          <div className="pt-4 pb-2">
            <div className={cn("h-px bg-white/10 mx-2", !isSidebarOpen && !isMobileMenuOpen && "hidden")} />
          </div>
          <NavItem icon={<Settings />} label="Settings" active={currentView === 'settings'} onClick={() => { setCurrentView('settings'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
        </nav>

        <div className="p-4 border-t border-white/10 hidden lg:block">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 min-h-screen flex flex-col w-full",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-20",
        "ml-0"
      )}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 capitalize">{currentView}</h2>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Active Tenant</span>
                <span className="text-xs font-bold text-slate-700 leading-tight">
                  {tenants.find(t => t.id === activeTenantId)?.name || 'Select Tenant'}
                </span>
              </div>
              <button 
                onClick={() => setCurrentView('tenants')}
                className="ml-2 p-1 hover:bg-slate-200 rounded-md transition-colors"
              >
                <Filter className="w-3 h-3 text-slate-400" />
              </button>
            </div>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Global Search..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 w-64"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={cn(
                  "relative p-2 text-slate-400 hover:text-primary transition-colors rounded-xl",
                  isNotificationsOpen && "bg-slate-100 text-emerald-600"
                )}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsNotificationsOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        {notifications.length > 0 && (
                          <button 
                            onClick={clearAllNotifications}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          <div className="divide-y divide-slate-50">
                            {notifications.map((notification) => (
                              <div 
                                key={notification.id}
                                onClick={() => markNotificationAsRead(notification.id)}
                                className={cn(
                                  "p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3",
                                  !notification.read && "bg-emerald-50/30"
                                )}
                              >
                                <div className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                  notification.type === 'warning' ? "bg-amber-100 text-amber-600" :
                                  notification.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                                  notification.type === 'error' ? "bg-rose-100 text-rose-600" :
                                  "bg-blue-100 text-blue-600"
                                )}>
                                  {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                                  {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                  {notification.type === 'error' && <XCircle className="w-5 h-5" />}
                                  {notification.type === 'info' && <Info className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <p className="text-sm font-bold text-slate-900 truncate">{notification.title}</p>
                                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{notification.time}</span>
                                  </div>
                                  <p className="text-xs text-slate-500 leading-relaxed">{notification.message}</p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0" />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                              <Bell className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-medium text-slate-500">No new notifications</p>
                          </div>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                          <button 
                            onClick={() => {
                              setCurrentView('notifications');
                              setIsNotificationsOpen(false);
                            }}
                            className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                          >
                            View All Activity
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Sanju Kumar</p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'dashboard' && renderDashboard()}
              {currentView === 'invoices' && renderInvoices()}
              {currentView === 'inventory' && renderInventory()}
              {currentView === 'customers' && renderCustomers()}
              {currentView === 'tenants' && renderTenants()}
              {currentView === 'billing' && renderBilling()}
              {currentView === 'plans' && renderPlans()}
              {currentView === 'reports' && renderReports()}
              {currentView === 'settings' && renderSettings()}
              {currentView === 'notifications' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold">All Activity</h2>
                    <button 
                      onClick={clearAllNotifications}
                      className="text-sm font-bold text-rose-600 hover:text-rose-700"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} className={cn("p-6 flex gap-4", !n.read && "bg-emerald-50/20")}>
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                          n.type === 'warning' ? "bg-amber-100 text-amber-600" :
                          n.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                          n.type === 'error' ? "bg-rose-100 text-rose-600" :
                          "bg-blue-100 text-blue-600"
                        )}>
                          {n.type === 'warning' && <AlertTriangle className="w-6 h-6" />}
                          {n.type === 'success' && <CheckCircle className="w-6 h-6" />}
                          {n.type === 'error' && <XCircle className="w-6 h-6" />}
                          {n.type === 'info' && <Info className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-slate-900">{n.title}</h4>
                            <span className="text-xs text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{n.message}</p>
                          {n.view && (
                            <button 
                              onClick={() => {
                                markNotificationAsRead(n.id);
                                setCurrentView(n.view!);
                              }}
                              className="text-xs font-bold text-emerald-600 hover:underline"
                            >
                              View Details
                            </button>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="p-20 text-center text-slate-400">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No activity found</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

        {/* New Invoice Modal */}
        <NewInvoiceModal 
          isOpen={isNewInvoiceModalOpen} 
          onClose={() => setIsNewInvoiceModalOpen(false)} 
          products={products}
          contacts={contacts}
          activeTenantId={activeTenantId}
          onSave={(invoice) => {
            setInvoices([invoice, ...invoices]);
            setIsNewInvoiceModalOpen(false);
            showToast('Invoice generated successfully!');
            addNotification(
              'Invoice Generated',
              `Invoice ${invoice.invoiceNumber} for ${formatCurrency(invoice.totalAmount)} has been created.`,
              'success',
              'invoices'
            );
          }}
        />

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              className={cn(
                "fixed bottom-8 left-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl text-white font-bold flex items-center gap-3",
                toast.type === 'success' ? "bg-emerald-600" : "bg-rose-600"
              )}
            >
              <ShieldCheck className="w-5 h-5" />
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

function NavItem({ icon, label, active, onClick, collapsed, primaryColor }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, collapsed: boolean, primaryColor: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
        active ? "text-white shadow-lg" : "text-white/60 hover:bg-white/5 hover:text-white",
        collapsed && "justify-center px-0"
      )}
      style={active ? { backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}33` } : {}}
    >
      <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}

function StatCard({ title, value, icon, trend, trendType }: { title: string, value: string, icon: React.ReactNode, trend: string, trendType: 'up' | 'down' }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
          trendType === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trendType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
  );
}

function NewInvoiceModal({ isOpen, onClose, products, contacts, activeTenantId, onSave }: { 
  isOpen: boolean, 
  onClose: () => void, 
  products: Product[], 
  contacts: Contact[],
  activeTenantId: string,
  onSave: (invoice: Invoice) => void 
}) {
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([]);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${format(new Date(), 'yyyy')}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [dueDate, setDueDate] = useState(format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), quantity: 1, price: 0, gstRate: 18, amount: 0, gstAmount: 0 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'productId') {
          const product = products.find(p => p.id === value);
          if (product) {
            updatedItem.name = product.name;
            updatedItem.hsnCode = product.hsnCode;
            updatedItem.price = product.price;
            updatedItem.gstRate = product.gstRate;
          }
        }
        
        const price = Number(updatedItem.price) || 0;
        const quantity = Number(updatedItem.quantity) || 0;
        const gstRate = Number(updatedItem.gstRate) || 0;
        
        const { taxableAmount, gstAmount } = calculateGST(price, gstRate, quantity);
        updatedItem.amount = taxableAmount;
        updatedItem.gstAmount = gstAmount;
        
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalGst = items.reduce((acc, curr) => acc + (curr.gstAmount || 0), 0);
  const totalAmount = subtotal + totalGst;

  const handleSave = () => {
    if (!selectedContactId || items.length === 0) {
      alert('Please select a customer and add at least one item.');
      return;
    }

    const hasIncompleteItems = items.some(item => !item.productId || !item.quantity || item.quantity <= 0);
    if (hasIncompleteItems) {
      alert('Please select a product and valid quantity for all line items.');
      return;
    }
    
    const newInvoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber,
      date: format(new Date(), 'yyyy-MM-dd'),
      dueDate,
      contactId: selectedContactId,
      tenantId: activeTenantId,
      items: items as InvoiceItem[],
      subtotal,
      totalGst,
      totalAmount,
      status: 'unpaid',
      type: 'sale'
    };
    
    onSave(newInvoice);
    setItems([]);
    setSelectedContactId('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
      >
        <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900">Create New Invoice</h3>
            <p className="text-[10px] md:text-xs text-slate-500 font-medium">Generate a professional tax invoice</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</label>
              <select 
                value={selectedContactId}
                onChange={(e) => setSelectedContactId(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
              >
                <option value="">Select Customer</option>
                {contacts.filter(c => c.type === 'customer').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice Number</label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Invoice Items</h4>
              <button 
                onClick={addItem}
                className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-100 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Line Item
              </button>
            </div>

            <div className="hidden md:block border border-slate-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[35%]">Product / Service</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[12%]">Quantity</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[15%]">Price</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[10%]">GST %</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[18%] text-right">Total</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-[10%]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <Package className="w-8 h-8 opacity-20" />
                          <p className="text-sm font-medium">No items added yet</p>
                          <button onClick={addItem} className="text-xs text-emerald-600 font-bold hover:underline">Click here to add your first item</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-4 py-4">
                          <select 
                            value={item.productId || ''}
                            onChange={(e) => updateItem(item.id!, 'productId', e.target.value)}
                            className="w-full bg-white border-slate-200 rounded-lg text-sm focus:ring-emerald-500/20 focus:border-emerald-500"
                          >
                            <option value="">Select Product</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <input 
                            type="number" 
                            min="1"
                            value={item.quantity || ''}
                            onChange={(e) => updateItem(item.id!, 'quantity', Number(e.target.value))}
                            className="w-full bg-white border-slate-200 rounded-lg text-sm focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                            <input 
                              type="number" 
                              value={item.price || ''}
                              onChange={(e) => updateItem(item.id!, 'price', Number(e.target.value))}
                              className="w-full bg-white border-slate-200 rounded-lg text-sm pl-7 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <select 
                            value={item.gstRate || 0}
                            onChange={(e) => updateItem(item.id!, 'gstRate', Number(e.target.value))}
                            className="w-full bg-white border-slate-200 rounded-lg text-sm focus:ring-emerald-500/20 focus:border-emerald-500"
                          >
                            <option value={0}>0%</option>
                            <option value={5}>5%</option>
                            <option value={12}>12%</option>
                            <option value={18}>18%</option>
                            <option value={28}>28%</option>
                          </select>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-slate-900">{formatCurrency((item.amount || 0) + (item.gstAmount || 0))}</span>
                            <span className="text-[10px] font-medium text-slate-400">GST: {formatCurrency(item.gstAmount || 0)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button 
                            onClick={() => removeItem(item.id!)}
                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Items Layout */}
            <div className="md:hidden space-y-4">
              {items.length === 0 ? (
                <div className="px-4 py-12 text-center border border-slate-100 rounded-2xl">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Package className="w-8 h-8 opacity-20" />
                    <p className="text-sm font-medium">No items added yet</p>
                    <button onClick={addItem} className="text-xs text-emerald-600 font-bold hover:underline">Click here to add your first item</button>
                  </div>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item Details</span>
                      <button 
                        onClick={() => removeItem(item.id!)}
                        className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Product</label>
                        <select 
                          value={item.productId || ''}
                          onChange={(e) => updateItem(item.id!, 'productId', e.target.value)}
                          className="w-full bg-white border-slate-200 rounded-lg text-sm focus:ring-emerald-500/20 focus:border-emerald-500"
                        >
                          <option value="">Select Product</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Quantity</label>
                          <input 
                            type="number" 
                            min="1"
                            value={item.quantity || ''}
                            onChange={(e) => updateItem(item.id!, 'quantity', Number(e.target.value))}
                            className="w-full bg-white border-slate-200 rounded-lg text-sm focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">GST %</label>
                          <select 
                            value={item.gstRate || 0}
                            onChange={(e) => updateItem(item.id!, 'gstRate', Number(e.target.value))}
                            className="w-full bg-white border-slate-200 rounded-lg text-sm focus:ring-emerald-500/20 focus:border-emerald-500"
                          >
                            <option value={0}>0%</option>
                            <option value={5}>5%</option>
                            <option value={12}>12%</option>
                            <option value={18}>18%</option>
                            <option value={28}>28%</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                          <input 
                            type="number" 
                            value={item.price || ''}
                            onChange={(e) => updateItem(item.id!, 'price', Number(e.target.value))}
                            className="w-full bg-white border-slate-200 rounded-lg text-sm pl-7 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Total</span>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">{formatCurrency((item.amount || 0) + (item.gstAmount || 0))}</p>
                          <p className="text-[10px] font-medium text-slate-400">Incl. GST: {formatCurrency(item.gstAmount || 0)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 sticky bottom-0 z-10">
          <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start w-full md:w-auto">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subtotal</p>
              <p className="text-lg md:text-xl font-bold text-slate-700">{formatCurrency(subtotal)}</p>
            </div>
            <div className="space-y-1 text-center md:text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total GST</p>
              <p className="text-lg md:text-xl font-bold text-slate-700">{formatCurrency(totalGst)}</p>
            </div>
            <div className="space-y-1 text-center md:text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grand Total</p>
              <p className="text-2xl md:text-3xl font-black text-emerald-600">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
          <div className="flex gap-3 md:gap-4 w-full md:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 md:flex-none px-6 md:px-8 py-3 md:py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 md:flex-none px-6 md:px-10 py-3 md:py-4 bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all active:translate-y-0"
            >
              Generate
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
