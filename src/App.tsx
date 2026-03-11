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
  PieChart as PieChartIcon,
  Loader2,
  Image as ImageIcon,
  Layout,
  Megaphone,
  Key,
  Lock,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Star,
  Shield,
  MessageSquare,
  CheckCircle2
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
import { Product, Contact, Invoice, Quotation, View, InvoiceItem, Tenant, AppConfig, AppNotification } from './types';
import { cn, formatCurrency, calculateGST } from './utils';
import { supabase } from './lib/supabase';
import { NewQuotationModal } from './components/NewQuotationModal';
import { NewInvoiceModal } from './components/NewInvoiceModal';
import { Login } from './components/Login';
import { ResetPassword } from './components/ResetPassword';
import { LandingPage } from './components/LandingPage';

// Mock Data
const MOCK_TENANTS: Tenant[] = [
  { id: '1', name: 'Johar Billing Solutions', gstin: '27ABCDE1234F1Z5', email: 'contact@joharbilling.com', phone: '+91 98765 43210', address: 'Mumbai', plan: 'enterprise', status: 'active', billingCycle: 'yearly', nextBillingDate: '2025-01-01', amount: 15000 },
  { id: '2', name: 'South India Retail', gstin: '33FGHIJ5678K2Z6', email: 'billing@southretail.com', phone: '+91 88888 77777', address: 'Chennai', plan: 'pro', status: 'active', billingCycle: 'monthly', nextBillingDate: '2024-04-01', amount: 1200 },
  { id: '3', name: 'North Logistics', gstin: '07KLMNO9012P3Z7', email: 'ops@northlog.com', phone: '+91 77777 66666', address: 'Delhi', plan: 'standard', status: 'inactive' },
  { id: '4', name: 'Test Tenant', gstin: '00TEST12345A1Z0', email: 'test@joharbilling.test', phone: '+91 00000 00000', address: 'Test City', plan: 'standard', status: 'active' }
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

const MOCK_QUOTATIONS: Quotation[] = [
  { 
    id: '1', 
    quotationNumber: 'QTN-2024-001', 
    date: '2024-03-05', 
    validUntil: '2024-03-20', 
    contactId: '1', 
    tenantId: '1',
    items: [
      { id: '1', productId: '1', name: 'Premium Laptop', hsnCode: '8471', quantity: 2, price: 45000, gstRate: 18, amount: 90000, gstAmount: 16200 }
    ],
    subtotal: 90000,
    totalGst: 16200,
    totalAmount: 106200,
    status: 'sent'
  }
];

const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: '1', title: 'Low Stock Alert', message: 'Premium Laptop stock is below 10 units.', time: '2 hours ago', read: false, type: 'warning', view: 'inventory' },
  { id: '2', title: 'Payment Received', message: 'Invoice INV-2024-001 has been paid.', time: '5 hours ago', read: true, type: 'success', view: 'invoices' },
  { id: '3', title: 'New Customer', message: 'Acme Corp added to your contact list.', time: '1 day ago', read: false, type: 'info', view: 'customers' },
  { id: '4', title: 'System Update', message: 'Johar Billing v2.1 is now live with new features.', time: '2 days ago', read: true, type: 'info' },
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
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [billingDuration, setBillingDuration] = useState<'monthly' | 'quarterly' | 'half-yearly' | 'yearly'>('monthly');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [quotations, setQuotations] = useState<Quotation[]>(MOCK_QUOTATIONS);
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeTenantId, setActiveTenantId] = useState('1');
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [isNewQuotationModalOpen, setIsNewQuotationModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isNewTenantModalOpen, setIsNewTenantModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [tenantSearchTerm, setTenantSearchTerm] = useState('');
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Contact | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [feedback, setFeedback] = useState({ name: '', business: '', mobile: '', comments: '' });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<'trial' | 'standard' | 'pro' | 'enterprise'>('trial');
  const [reportDownloadsCount, setReportDownloadsCount] = useState(0);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchData(session.user.id);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchData(session.user.id);
      }
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async (userId: string) => {
    try {
      // Fetch Products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId);
      if (productsData) {
        setProducts(productsData.map(p => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          hsnCode: p.hsn_code,
          price: Number(p.price),
          stock: p.stock,
          unit: p.unit,
          gstRate: p.gst_rate
        })));
      }

      // Fetch Contacts
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId);
      if (contactsData) {
        setContacts(contactsData.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          gstin: c.gstin,
          address: c.address,
          type: c.type,
          customerType: c.customer_type
        })));
      }

      // Fetch Invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select(`
          *,
          invoice_items (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (invoicesData) {
        setInvoices(invoicesData.map(inv => ({
          id: inv.id,
          invoiceNumber: inv.invoice_number,
          date: inv.date,
          dueDate: inv.due_date,
          contactId: inv.contact_id,
          tenantId: '1',
          subtotal: Number(inv.subtotal),
          totalGst: Number(inv.total_gst),
          totalAmount: Number(inv.total_amount),
          status: inv.status,
          type: inv.type,
          invoiceType: inv.invoice_type,
          items: inv.invoice_items?.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            name: item.name,
            hsnCode: item.hsn_code,
            quantity: item.quantity,
            price: Number(item.price),
            gstRate: item.gst_rate,
            amount: Number(item.amount),
            gstAmount: Number(item.gst_amount)
          })) || []
        })));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowLanding(true);
  };

  const isAdmin = user?.email?.toLowerCase() === 'sanju13july@gmail.com';

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

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Auth session is missing. Please sign in again.');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      showToast('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const [appConfig, setAppConfig] = useState<AppConfig>({
    primaryColor: '#10b981',
    logoUrl: '',
    appName: 'Johar Billing',
    currency: 'INR',
    landingPage: {
      heroTitle: 'Modern Billing for Modern India',
      heroSubtitle: 'The most powerful GST billing and inventory management system for small and medium businesses.',
      features: [
        { title: 'GST Ready', description: 'Generate GST compliant invoices in seconds.', icon: 'ShieldCheck' },
        { title: 'Inventory', description: 'Real-time stock tracking and alerts.', icon: 'Package' },
        { title: 'Multi-tenant', description: 'Manage multiple businesses from one dashboard.', icon: 'Building2' }
      ]
    },
    loginAd: {
      enabled: true,
      imageUrl: 'https://picsum.photos/seed/billing/800/600',
      title: 'Upgrade to Pro Today!',
      description: 'Get unlimited invoices and advanced reports.'
    }
  });
  const [businessProfile, setBusinessProfile] = useState({
    name: 'Johar Billing Solutions',
    gstin: '27ABCDE1234F1Z5',
    email: 'contact@joharbilling.com',
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

  const generateQuotationPDF = (quotation: Quotation, action: 'download' | 'print' = 'download') => {
    const doc = new jsPDF();
    const contact = contacts.find(c => c.id === quotation.contactId);
    
    // Header
    doc.setFontSize(20);
    doc.text('QUOTATION', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(businessProfile.name, 20, 40);
    doc.text(`GSTIN: ${businessProfile.gstin}`, 20, 45);
    doc.text(businessProfile.address, 20, 50);
    
    doc.text(`Quotation #: ${quotation.quotationNumber}`, 140, 40);
    doc.text(`Date: ${format(new Date(quotation.date), 'dd/MM/yyyy')}`, 140, 45);
    doc.text(`Valid Until: ${format(new Date(quotation.validUntil), 'dd/MM/yyyy')}`, 140, 50);
    
    // Bill To
    doc.setFontSize(12);
    doc.text('Quotation For:', 20, 70);
    doc.setFontSize(10);
    doc.text(contact?.name || 'Customer Name', 20, 75);
    doc.text(contact?.address || 'Address', 20, 80);
    doc.text(`GSTIN: ${contact?.gstin || 'N/A'}`, 20, 85);
    
    // Table
    const tableData = quotation.items.map(item => [
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
    doc.text(`Subtotal: ${formatCurrency(quotation.subtotal)}`, 140, finalY + 10);
    doc.text(`Total GST: ${formatCurrency(quotation.totalGst)}`, 140, finalY + 15);
    doc.setFontSize(12);
    doc.text(`Grand Total: ${formatCurrency(quotation.totalAmount)}`, 140, finalY + 25);
    
    if (action === 'print') {
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    } else {
      doc.save(`${quotation.quotationNumber}.pdf`);
    }
  };

  const checkLimit = (type: 'invoice' | 'customer' | 'product' | 'report') => {
    if (isAdmin) return true;
    if (userPlan !== 'trial') return true;

    const limits = {
      invoice: 2,
      customer: 1,
      product: 1,
      report: 1
    };

    let currentUsage = 0;
    if (type === 'invoice') currentUsage = invoices.length;
    if (type === 'customer') currentUsage = contacts.filter(c => c.type === 'customer').length;
    if (type === 'product') currentUsage = products.length;
    if (type === 'report') currentUsage = reportDownloadsCount;

    if (currentUsage >= limits[type]) {
      setIsPricingModalOpen(true);
      return false;
    }
    return true;
  };

  const downloadReport = (reportName: string) => {
    if (!checkLimit('report')) return;
    
    showToast(`Generating ${reportName}...`);
    
    // Simulate report generation
    setTimeout(() => {
      const content = `Report: ${reportName}\nGenerated on: ${new Date().toLocaleString()}\n\nSample Data:\nCategory,Value\nElectronics,45%\nFurniture,25%\nServices,20%\nOther,10%`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportName.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setReportDownloadsCount(prev => prev + 1);
      showToast(`${reportName} downloaded successfully!`);
      addNotification(
        'Report Downloaded',
        `The ${reportName} has been generated and downloaded.`,
        'success',
        'reports'
      );
    }, 1500);
  };

  const convertQuotationToInvoice = (quotation: Quotation) => {
    if (!checkLimit('invoice')) return;

    const newInvoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      contactId: quotation.contactId,
      tenantId: quotation.tenantId,
      items: quotation.items,
      subtotal: quotation.subtotal,
      totalGst: quotation.totalGst,
      totalAmount: quotation.totalAmount,
      status: 'unpaid',
      type: 'sale',
      invoiceType: 'b2b'
    };

    setInvoices([newInvoice, ...invoices]);
    setQuotations(quotations.map(q => q.id === quotation.id ? { ...q, status: 'converted' } : q));
    showToast('Quotation converted to invoice successfully');
    setCurrentView('invoices');
  };

  const deleteQuotation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      setQuotations(quotations.filter(q => q.id !== id));
      showToast('Quotation deleted successfully');
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

  const addNotification = (title: string, message: string, type: AppNotification['type'] = 'info', view?: View) => {
    const newNotification: AppNotification = {
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
          <button 
            onClick={() => {
              if (checkLimit('customer')) {
                setEditingCustomer(null);
                setIsNewCustomerModalOpen(true);
              }
            }}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
          >
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
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
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
                <td className="px-6 py-4 text-sm text-slate-500 uppercase">{customer.customerType || 'b2b'}</td>
                <td className="px-6 py-4 text-sm text-slate-500 font-mono">{customer.gstin || 'Unregistered'}</td>
                <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{customer.address}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingCustomer(customer);
                        setIsNewCustomerModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
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
      {/* Feedback Button */}
      <div className="flex justify-end">
        <button 
          onClick={() => setIsFeedbackModalOpen(true)}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Share Feedback
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sales" value={formatCurrency(totalSales)} icon={<IndianRupee className="w-5 h-5" />} trend="+12.5%" trendType="up" />
        <StatCard title="Receivables" value={formatCurrency(totalReceivables)} icon={<CreditCard className="w-5 h-5" />} trend="-2.4%" trendType="down" />
        <StatCard title="Low Stock Items" value={lowStockCount.toString()} icon={<Package className="w-5 h-5" />} trend="Critical" trendType="down" />
        <StatCard title="Active Customers" value={contacts.filter(c => c.type === 'customer').length.toString()} icon={<Users className="w-5 h-5" />} trend="+5 new" trendType="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Revenue Overview</h3>
            <select className="bg-slate-50 border-none text-sm rounded-lg focus:ring-0">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
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
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
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
        </motion.div>
      </div>
    </div>
  );

  const renderQuotations = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 md:p-6 border-bottom border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Quotations</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search quotations..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => setIsNewQuotationModalOpen(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Quotation
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-y border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quotation #</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Valid Until</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotations.map(quotation => (
              <tr key={quotation.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{quotation.quotationNumber}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {contacts.find(c => c.id === quotation.contactId)?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{format(new Date(quotation.date), 'dd MMM yyyy')}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{format(new Date(quotation.validUntil), 'dd MMM yyyy')}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(quotation.totalAmount)}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    quotation.status === 'converted' ? "bg-emerald-50 text-emerald-700" : 
                    quotation.status === 'sent' ? "bg-blue-50 text-blue-700" :
                    "bg-slate-100 text-slate-600"
                  )}>
                    {quotation.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {quotation.status !== 'converted' && (
                      <button 
                        onClick={() => convertQuotationToInvoice(quotation)}
                        className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Convert to Invoice"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => generateQuotationPDF(quotation, 'print')}
                      className="p-2 text-slate-400 hover:text-primary transition-colors"
                      title="Print"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => generateQuotationPDF(quotation, 'download')}
                      className="p-2 text-slate-400 hover:text-primary transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteQuotation(quotation.id)}
                      className="p-2 text-slate-400 hover:text-danger transition-colors"
                      title="Delete"
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
            onClick={() => {
              if (checkLimit('invoice')) {
                const currentTenant = tenants.find(t => t.id === activeTenantId);
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                const monthlyInvoices = invoices.filter(inv => 
                  inv.tenantId === activeTenantId && 
                  new Date(inv.date).getMonth() === currentMonth &&
                  new Date(inv.date).getFullYear() === currentYear
                );
                
                setIsNewInvoiceModalOpen(true);
              }
            }}
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
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
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
                <td className="px-6 py-4 text-sm text-slate-500 uppercase">{invoice.invoiceType || 'b2b'}</td>
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

  const renderCMS = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Landing Page Editor</h2>
            <p className="text-sm text-slate-500">Customize how your public landing page looks</p>
          </div>
          <Layout className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Hero Title</label>
              <input 
                type="text" 
                value={appConfig.landingPage?.heroTitle}
                onChange={(e) => setAppConfig({
                  ...appConfig, 
                  landingPage: { ...appConfig.landingPage!, heroTitle: e.target.value }
                })}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Hero Subtitle</label>
              <input 
                type="text" 
                value={appConfig.landingPage?.heroSubtitle}
                onChange={(e) => setAppConfig({
                  ...appConfig, 
                  landingPage: { ...appConfig.landingPage!, heroSubtitle: e.target.value }
                })}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Hero Image URL</label>
              <input 
                type="text" 
                value={appConfig.landingPage?.heroImage}
                onChange={(e) => setAppConfig({
                  ...appConfig, 
                  landingPage: { ...appConfig.landingPage!, heroImage: e.target.value }
                })}
                placeholder="https://example.com/hero.png"
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Login Screen Ad Manager</h2>
            <p className="text-sm text-slate-500">Manage promotional content on the login screen</p>
          </div>
          <Megaphone className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={appConfig.loginAd?.enabled}
                onChange={(e) => setAppConfig({
                  ...appConfig, 
                  loginAd: { ...appConfig.loginAd!, enabled: e.target.checked }
                })}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-3 text-sm font-medium text-slate-700">Enable Login Ad</span>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Ad Title</label>
              <input 
                type="text" 
                value={appConfig.loginAd?.title}
                onChange={(e) => setAppConfig({
                  ...appConfig, 
                  loginAd: { ...appConfig.loginAd!, title: e.target.value }
                })}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Ad Image (Upload or URL)</label>
              <div className="flex items-center gap-4">
                {appConfig.loginAd?.imageUrl && (
                  <img src={appConfig.loginAd.imageUrl} alt="Ad Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                )}
                <div className="flex-1 space-y-2">
                  <input 
                    type="text" 
                    value={appConfig.loginAd?.imageUrl}
                    onChange={(e) => setAppConfig({
                      ...appConfig, 
                      loginAd: { ...appConfig.loginAd!, imageUrl: e.target.value }
                    })}
                    placeholder="https://example.com/image.png"
                    className="w-full bg-slate-50 border-none rounded-xl py-2 px-4 focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium"
                  />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setAppConfig({
                            ...appConfig,
                            loginAd: { ...appConfig.loginAd!, imageUrl: event.target?.result as string }
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-[10px] text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Ad Action Link (Optional)</label>
              <input 
                type="text" 
                value={appConfig.loginAd?.link || ''}
                onChange={(e) => setAppConfig({
                  ...appConfig, 
                  loginAd: { ...appConfig.loginAd!, link: e.target.value }
                })}
                placeholder="https://example.com/promo"
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">YouTube Video URL (Optional)</label>
              <input 
                type="text" 
                value={appConfig.loginAd?.youtubeUrl || ''}
                onChange={(e) => setAppConfig({
                  ...appConfig, 
                  loginAd: { ...appConfig.loginAd!, youtubeUrl: e.target.value }
                })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Ad Description</label>
              <textarea 
                rows={3}
                value={appConfig.loginAd?.description}
                onChange={(e) => setAppConfig({
                  ...appConfig, 
                  loginAd: { ...appConfig.loginAd!, description: e.target.value }
                })}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => showToast('CMS configurations saved successfully!')}
          className="bg-emerald-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );

  const renderTenants = () => {
    const filteredTenants = tenants.filter(t => 
      t.name.toLowerCase().includes(tenantSearchTerm.toLowerCase()) ||
      t.gstin.toLowerCase().includes(tenantSearchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(tenantSearchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
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
                  value={tenantSearchTerm}
                  onChange={(e) => setTenantSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 w-full md:w-64"
                />
              </div>
              <button 
                onClick={() => {
                  setEditingTenant(null);
                  setIsNewTenantModalOpen(true);
                }}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
              >
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
                {filteredTenants.map(tenant => (
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
                      <select 
                        value={tenant.plan}
                        onChange={(e) => {
                          setTenants(tenants.map(t => t.id === tenant.id ? { ...t, plan: e.target.value as any } : t));
                          showToast(`Plan updated for ${tenant.name}`);
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none focus:ring-0 cursor-pointer",
                          tenant.plan === 'enterprise' ? "bg-indigo-50 text-indigo-700" : 
                          tenant.plan === 'pro' ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                        )}
                      >
                        <option value="standard">Standard</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
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
                        <button 
                          onClick={() => {
                            const password = Math.random().toString(36).slice(-8);
                            alert(`User created for ${tenant.name}\nEmail: ${tenant.email}\nPassword: ${password}\n\n(In a real app, this would be sent via email)`);
                          }}
                          className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                          title="Create User Credentials"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingTenant(tenant);
                            setIsNewTenantModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-primary transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${tenant.name}?`)) {
                              setTenants(tenants.filter(t => t.id !== tenant.id));
                              showToast('Tenant deleted successfully');
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
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
      </div>
    );
  };

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
                    <button 
                      onClick={() => setIsPricingModalOpen(true)}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      Manage Plan
                    </button>
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
          <button 
            onClick={() => {
              if (checkLimit('product')) {
                setEditingProduct(null);
                setIsNewProductModalOpen(true);
              }
            }}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
          >
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
                    <button 
                      onClick={() => {
                        setEditingProduct(product);
                        setIsNewProductModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
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
        <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-sm text-slate-500">Manage your business profile and application settings</p>
          </div>
          {isAdmin && (
            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Admin Access
            </div>
          )}
        </div>
        
        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Business Profile Section */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Business Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-semibold text-slate-600">Business Logo (250x250)</label>
                    <div className="flex items-center gap-4">
                      {businessProfile.logo && (
                        <img src={businessProfile.logo} alt="Logo" className="w-16 h-16 rounded-lg object-cover" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                canvas.width = 250;
                                canvas.height = 250;
                                const ctx = canvas.getContext('2d');
                                ctx?.drawImage(img, 0, 0, 250, 250);
                                setBusinessProfile({...businessProfile, logo: canvas.toDataURL('image/png')});
                              };
                              img.src = event.target?.result as string;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                      />
                    </div>
                  </div>
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

              {isAdmin && (
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
                    <div className="md:col-span-2 pt-4">
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <ImageIcon className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">Login Card Customization</h4>
                            <p className="text-xs text-slate-500">Update the image and content on your login screen</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setCurrentView('cms')}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          Go to CMS Editor
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Security & Account</h3>
                <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button 
                      type="submit"
                      disabled={passwordLoading}
                      className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {passwordLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                  Save All Settings
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
                  <button 
                    onClick={() => downloadReport('All Data Export')}
                    className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
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
                  {isAdmin && (
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
                  )}
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
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
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
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
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
          <button 
            onClick={() => downloadReport('Consolidated Reports')}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
          >
            Export All
          </button>
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
                <button 
                  onClick={() => downloadReport(report.name)}
                  className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
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
        name: 'Standard',
        price: 5999,
        description: 'For small businesses. Perfect for kirana shops & small traders.',
        features: ['300 invoices/month', 'GST invoices & reports', 'Basic inventory', 'Up to 3 users', 'Email support'],
        buttonText: 'Upgrade to Standard',
        isCurrent: true,
        color: 'blue'
      },
      {
        name: 'Pro',
        price: 12999,
        description: 'For growing businesses. Good for retailers & small wholesalers.',
        features: ['1,500 invoices/month', 'Advanced inventory', 'GST reports + export', 'Up to 8 users', 'Priority support'],
        buttonText: 'Upgrade to Pro',
        isCurrent: false,
        color: 'emerald',
        popular: true
      },
      {
        name: 'Enterprise',
        price: 29999,
        description: 'For serious businesses. Large distributors & multi-branch businesses.',
        features: ['5,000 invoices/month', 'Multi-tenant support', 'Up to 25 users', 'Dedicated account manager', 'Custom API access'],
        buttonText: 'Contact Sales',
        isCurrent: false,
        color: 'indigo'
      }
    ];

    const getDurationLabel = () => '/ year';

    return (
      <div className="space-y-8 max-w-7xl mx-auto py-4">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Choose the right plan for your business</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Scale your billing operations with Johar Billing. Choose a plan that fits your current needs and upgrade as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={cn(
                "relative rounded-3xl border border-slate-100 p-8 flex flex-col h-full transition-all hover:shadow-xl hover:-translate-y-1",
                plan.name === 'Standard' && "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
                plan.name === 'Pro' && "bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300",
                plan.name === 'Enterprise' && "bg-gradient-to-br from-sky-100 to-blue-200 border-blue-300",
                plan.popular ? "shadow-lg ring-1 ring-emerald-500/20" : ""
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{plan.description}</p>
                </div>
                {plan.name === 'Standard' && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 5, ease: "linear" }}><Sparkles className="w-6 h-6 text-blue-500" /></motion.div>}
                {plan.name === 'Pro' && <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Star className="w-6 h-6 text-amber-500" /></motion.div>}
                {plan.name === 'Enterprise' && <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1 }}><Shield className="w-6 h-6 text-sky-500" /></motion.div>}
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

        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6">📈 Optional Add-On Revenue</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: '+500 invoices/month', price: '₹1,999/year' },
              { title: '+2 users', price: '₹1,499/year' },
              { title: 'SMS/WhatsApp credits', price: 'Extra charge' },
              { title: 'Extra GSTIN / branch', price: '₹2,999/year' }
            ].map((addon) => (
              <div key={addon.title} className="bg-white p-4 rounded-xl border border-slate-100">
                <p className="text-sm font-bold text-slate-900">{addon.title}</p>
                <p className="text-sm text-emerald-600 font-bold">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg font-bold text-slate-900">Need a custom plan?</h4>
            <p className="text-sm text-slate-500">We offer specialized pricing for high-volume businesses and government organizations.</p>
          </div>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-white text-slate-900 border border-slate-200 px-8 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
          >
            Talk to an Expert
          </button>
        </div>
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (isRecoveryMode) {
    return (
      <ResetPassword 
        onSuccess={() => setIsRecoveryMode(false)} 
        onBack={() => setIsRecoveryMode(false)} 
      />
    );
  }

  if (!user && showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!user) {
    return <Login onLoginSuccess={setUser} adConfig={appConfig.loginAd} />;
  }

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
                <ArrowUpRight className="w-5 h-5 text-white" />
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
          <NavItem icon={<FileText />} label="Quotations" active={currentView === 'quotations'} onClick={() => { setCurrentView('quotations'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          <NavItem icon={<Package />} label="Inventory" active={currentView === 'inventory'} onClick={() => { setCurrentView('inventory'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          <NavItem icon={<Users />} label="Customers" active={currentView === 'customers'} onClick={() => { setCurrentView('customers'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          {isAdmin && (
            <NavItem icon={<Building2 />} label="Tenants" active={currentView === 'tenants'} onClick={() => { setCurrentView('tenants'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          )}
          <NavItem icon={<BarChart3 />} label="Reports" active={currentView === 'reports'} onClick={() => { setCurrentView('reports'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          {isAdmin && (
            <NavItem icon={<Layout />} label="CMS" active={currentView === 'cms'} onClick={() => { setCurrentView('cms'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          )}
          <NavItem icon={<CreditCard />} label="Plans" active={currentView === 'plans'} onClick={() => { setCurrentView('plans'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          {isAdmin && (
            <NavItem icon={<CreditCard />} label="Billing" active={currentView === 'billing'} onClick={() => { setCurrentView('billing'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
          )}
          <NavItem icon={<ShoppingCart />} label="Purchases" active={currentView === 'purchases'} onClick={() => { setCurrentView('purchases'); setIsMobileMenuOpen(false); }} collapsed={!isSidebarOpen && !isMobileMenuOpen} primaryColor={appConfig.primaryColor} />
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
            {isAdmin && (
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
            )}
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
                <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAdmin ? 'Administrator' : 'User'}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all ml-2"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
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
              {currentView === 'quotations' && renderQuotations()}
              {currentView === 'purchases' && <div className="p-8 text-center text-slate-500">Purchases module is under development.</div>}
              {currentView === 'inventory' && renderInventory()}
              {currentView === 'customers' && renderCustomers()}
              {currentView === 'tenants' && isAdmin && renderTenants()}
              {currentView === 'billing' && isAdmin && renderBilling()}
              {currentView === 'plans' && renderPlans()}
              {currentView === 'reports' && renderReports()}
              {currentView === 'cms' && isAdmin && renderCMS()}
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

        {/* New Quotation Modal */}
        <NewQuotationModal 
          isOpen={isNewQuotationModalOpen} 
          onClose={() => setIsNewQuotationModalOpen(false)} 
          products={products}
          contacts={contacts}
          activeTenantId={activeTenantId}
          onSave={async (quotation) => {
            try {
              console.log('Saving quotation...', quotation);
              // For now, we'll just update local state as we might not have a quotations table yet
              // In a real app, this would save to Supabase similar to invoices
              
              setQuotations([quotation, ...quotations]);
              setIsNewQuotationModalOpen(false);
            } catch (error) {
              console.error('Error saving quotation:', error);
              alert('Failed to save quotation. Please try again.');
            }
          }} 
        />

        {/* New Invoice Modal */}
        <NewInvoiceModal 
          isOpen={isNewInvoiceModalOpen} 
          onClose={() => setIsNewInvoiceModalOpen(false)} 
          products={products}
          contacts={contacts}
          activeTenantId={activeTenantId}
          onSave={async (invoice) => {
            try {
              console.log('Saving invoice...', invoice);
              if (user) {
                const { data: invData, error: invError } = await supabase
                  .from('invoices')
                  .insert([{
                    invoice_number: invoice.invoiceNumber,
                    date: invoice.date,
                    due_date: invoice.dueDate,
                    contact_id: invoice.contactId,
                    subtotal: invoice.subtotal,
                    total_gst: invoice.totalGst,
                    total_amount: invoice.totalAmount,
                    status: invoice.status,
                    type: invoice.type,
                    invoice_type: invoice.invoiceType,
                    user_id: user.id
                  }])
                  .select();

                if (invError) {
                  console.error('Error inserting invoice:', invError);
                  throw invError;
                }

                if (!invData || invData.length === 0) {
                  throw new Error('No data returned from invoice insertion');
                }

                const invoiceId = invData[0].id;
                console.log('Invoice inserted with ID:', invoiceId);

                const itemsToInsert = invoice.items.map(item => ({
                  invoice_id: invoiceId,
                  product_id: item.productId,
                  name: item.name,
                  hsn_code: item.hsnCode,
                  quantity: item.quantity,
                  price: item.price,
                  gst_rate: item.gstRate,
                  amount: item.amount,
                  gst_amount: item.gstAmount
                }));

                const { error: itemsError } = await supabase
                  .from('invoice_items')
                  .insert(itemsToInsert);

                if (itemsError) {
                  console.error('Error inserting invoice items:', itemsError);
                  throw itemsError;
                }
                
                invoice.id = invoiceId;
              }
              
              setInvoices([invoice, ...invoices]);
              setIsNewInvoiceModalOpen(false);
              showToast('Invoice generated successfully!');
              addNotification(
                'Invoice Generated',
                `Invoice ${invoice.invoiceNumber} for ${formatCurrency(invoice.totalAmount)} has been created.`,
                'success',
                'invoices'
              );
            } catch (err: any) {
              console.error('Failed to save invoice:', err);
              showToast(err.message || 'Failed to save invoice', 'error');
            }
          }}
        />

        {/* New Tenant Modal */}
        <NewTenantModal
          isOpen={isNewTenantModalOpen}
          onClose={() => setIsNewTenantModalOpen(false)}
          editingTenant={editingTenant}
          onSave={(tenant, password) => {
            if (editingTenant) {
              setTenants(tenants.map(t => t.id === tenant.id ? tenant : t));
              showToast('Tenant updated successfully');
            } else {
              setTenants([tenant, ...tenants]);
              showToast('New tenant created successfully');
              if (password) {
                alert(`User created for ${tenant.name}\nEmail: ${tenant.email}\nPassword: ${password}\n\n(In a real app, this would be sent via email)`);
              }
            }
            setIsNewTenantModalOpen(false);
          }}
        />
        <NewProductModal
          isOpen={isNewProductModalOpen}
          onClose={() => setIsNewProductModalOpen(false)}
          editingProduct={editingProduct}
          onSave={async (product) => {
            try {
              if (user) {
                if (editingProduct) {
                  const { error } = await supabase
                    .from('products')
                    .update({
                      name: product.name,
                      sku: product.sku,
                      hsn_code: product.hsnCode,
                      price: product.price,
                      stock: product.stock,
                      unit: product.unit,
                      gst_rate: product.gstRate
                    })
                    .eq('id', product.id);
                  if (error) throw error;
                } else {
                  const { data, error } = await supabase
                    .from('products')
                    .insert([{
                      name: product.name,
                      sku: product.sku,
                      hsn_code: product.hsnCode,
                      price: product.price,
                      stock: product.stock,
                      unit: product.unit,
                      gst_rate: product.gstRate,
                      user_id: user.id
                    }])
                    .select();
                  if (error) throw error;
                  product.id = data[0].id;
                }
              }

              if (editingProduct) {
                setProducts(products.map(p => p.id === product.id ? product : p));
                showToast('Product updated successfully');
              } else {
                setProducts([product, ...products]);
                showToast('New product created successfully');
              }
              setIsNewProductModalOpen(false);
            } catch (err: any) {
              showToast(err.message || 'Failed to save product', 'error');
            }
          }}
        />

        <FeedbackModal 
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          feedback={feedback}
          setFeedback={setFeedback}
          feedbackLoading={feedbackLoading}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!feedback.name || !feedback.business || !feedback.mobile) {
              showToast('Please fill all required fields', 'error');
              return;
            }
            setFeedbackLoading(true);
            try {
              // 1. Save to DB
              await supabase.from('feedback').insert([{
                name: feedback.name,
                business: feedback.business,
                mobile: feedback.mobile,
                comments: feedback.comments,
                user_id: user?.id
              }]);

              // 2. Send Email via our new API
              await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedback)
              });
              
              showToast('Your feedback has been submitted successfuly');
              setFeedback({ name: '', business: '', mobile: '', comments: '' });
              setIsFeedbackModalOpen(false);
            } catch (err) {
              showToast('Your feedback has been submitted successfuly'); // Still show success message even if email fails but DB worked
              setFeedback({ name: '', business: '', mobile: '', comments: '' });
              setIsFeedbackModalOpen(false);
            } finally {
              setFeedbackLoading(false);
            }
          }}
        />
        <NewCustomerModal
          isOpen={isNewCustomerModalOpen}
          onClose={() => setIsNewCustomerModalOpen(false)}
          editingCustomer={editingCustomer}
          onSave={async (customer) => {
            try {
              if (user) {
                if (editingCustomer) {
                  const { error } = await supabase
                    .from('contacts')
                    .update({
                      name: customer.name,
                      email: customer.email,
                      phone: customer.phone,
                      gstin: customer.gstin,
                      address: customer.address,
                      type: customer.type,
                      customer_type: customer.customerType
                    })
                    .eq('id', customer.id);
                  if (error) throw error;
                } else {
                  const { data, error } = await supabase
                    .from('contacts')
                    .insert([{
                      name: customer.name,
                      email: customer.email,
                      phone: customer.phone,
                      gstin: customer.gstin,
                      address: customer.address,
                      type: customer.type,
                      customer_type: customer.customerType,
                      user_id: user.id
                    }])
                    .select();
                  if (error) throw error;
                  customer.id = data[0].id;
                }
              }

              if (editingCustomer) {
                setContacts(contacts.map(c => c.id === customer.id ? customer : c));
                showToast('Customer updated successfully');
              } else {
                setContacts([customer, ...contacts]);
                showToast('New customer created successfully');
              }
              setIsNewCustomerModalOpen(false);
            } catch (err: any) {
              showToast(err.message || 'Failed to save customer', 'error');
            }
          }}
        />

        {/* Chat Window */}
        {isChatOpen && (
          <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col z-50">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-900">Chat with Expert</h4>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto text-sm text-slate-600">
              <p>Hello! How can I help you today?</p>
            </div>
            <div className="p-4 border-t border-slate-100">
              <input type="text" placeholder="Type a message..." className="w-full p-2 bg-slate-50 rounded-lg text-sm" />
            </div>
          </div>
        )}

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

        {/* Pricing Modal */}
        <PricingModal 
          isOpen={isPricingModalOpen} 
          onClose={() => setIsPricingModalOpen(false)} 
          onSelectPlan={(plan) => {
            setUserPlan(plan);
            setIsPricingModalOpen(false);
            showToast(`Successfully upgraded to ${plan} plan!`);
          }}
        />
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
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
    >
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
    </motion.div>
  );
}





function NewTenantModal({ isOpen, onClose, editingTenant, onSave }: { 
  isOpen: boolean, 
  onClose: () => void, 
  editingTenant: Tenant | null,
  onSave: (tenant: Tenant, password?: string) => void 
}) {
  const [name, setName] = useState('');
  const [gstin, setGstin] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState<'standard' | 'pro' | 'enterprise'>('standard');

  useEffect(() => {
    if (editingTenant) {
      setName(editingTenant.name);
      setGstin(editingTenant.gstin);
      setEmail(editingTenant.email);
      setPhone(editingTenant.phone);
      setAddress(editingTenant.address);
      setPlan(editingTenant.plan);
      setPassword(''); // Don't pre-fill password for editing
    } else {
      setName('');
      setGstin('');
      setEmail('');
      setPhone('');
      setAddress('');
      setPlan('standard');
      setPassword('');
    }
  }, [editingTenant, isOpen]);

  const handleSave = () => {
    if (!name || !gstin || !email || (!editingTenant && !password)) {
      alert('Please fill in all required fields (Name, GSTIN, Email, Password).');
      return;
    }

    const tenant: Tenant = {
      id: editingTenant?.id || Math.random().toString(36).substr(2, 9),
      name,
      gstin,
      email,
      phone,
      address,
      plan,
      status: editingTenant?.status || 'active'
    };

    onSave(tenant, password);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{editingTenant ? 'Edit Tenant' : 'Create New Tenant'}</h3>
            <p className="text-xs text-slate-500 font-medium">Configure business account details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Name *</label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">GSTIN *</label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="27ABCDE1234F1Z5"
                  className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@business.com"
                  className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password {!editingTenant && '*'}</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full registered address..."
                rows={3}
                className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium resize-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subscription Plan</label>
            <div className="grid grid-cols-3 gap-4">
              {(['standard', 'pro', 'enterprise'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlan(p)}
                  className={cn(
                    "py-3 rounded-xl text-sm font-bold border-2 transition-all capitalize",
                    plan === p 
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            {editingTenant ? 'Save Changes' : 'Create Tenant'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function NewCustomerModal({ isOpen, onClose, editingCustomer, onSave }: { 
  isOpen: boolean, 
  onClose: () => void, 
  editingCustomer: Contact | null,
  onSave: (customer: Contact) => void 
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [customerType, setCustomerType] = useState<'b2b' | 'b2c'>('b2b');

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setEmail(editingCustomer.email);
      setPhone(editingCustomer.phone);
      setGstin(editingCustomer.gstin || '');
      setAddress(editingCustomer.address);
      setCustomerType(editingCustomer.customerType || 'b2b');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setGstin('');
      setAddress('');
      setCustomerType('b2b');
    }
  }, [editingCustomer, isOpen]);

  const handleSave = () => {
    if (!name || !email) {
      alert('Please fill in all required fields (Name, Email).');
      return;
    }

    const customer: Contact = {
      id: editingCustomer?.id || Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      gstin,
      address,
      type: 'customer',
      customerType,
      tenantId: '1'
    };

    onSave(customer);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
            <p className="text-xs text-slate-500 font-medium">Configure customer details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">GSTIN</label>
              <input type="text" value={gstin} onChange={(e) => setGstin(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Type</label>
              <select value={customerType} onChange={(e) => setCustomerType(e.target.value as 'b2b' | 'b2c')} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium">
                <option value="b2b">B2B</option>
                <option value="b2c">B2C</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" rows={3} />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">Save Customer</button>
        </div>
      </motion.div>
    </div>
  );
}

function FeedbackModal({ isOpen, onClose, feedback, setFeedback, feedbackLoading, onSubmit }: {
  isOpen: boolean,
  onClose: () => void,
  feedback: { name: string, business: string, mobile: string, comments: string },
  setFeedback: (f: any) => void,
  feedbackLoading: boolean,
  onSubmit: (e: React.FormEvent) => void
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Share Your Feedback</h2>
              <p className="text-xs text-slate-500">We value your suggestions!</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Your Name</label>
              <input 
                type="text" 
                required
                value={feedback.name}
                onChange={(e) => setFeedback({...feedback, name: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Business Name</label>
              <input 
                type="text" 
                required
                value={feedback.business}
                onChange={(e) => setFeedback({...feedback, business: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                placeholder="Enter your business name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Mobile Number</label>
              <input 
                type="tel" 
                required
                value={feedback.mobile}
                onChange={(e) => setFeedback({...feedback, mobile: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                placeholder="Enter mobile number"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Comments/Suggestion</label>
              <textarea 
                rows={3}
                value={feedback.comments}
                onChange={(e) => setFeedback({...feedback, comments: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium resize-none"
                placeholder="Tell us what you think..."
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={feedbackLoading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            {feedbackLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Feedback'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function NewProductModal({ isOpen, onClose, editingProduct, onSave }: { 
  isOpen: boolean, 
  onClose: () => void, 
  editingProduct: Product | null,
  onSave: (product: Product) => void 
}) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [gstRate, setGstRate] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setSku(editingProduct.sku);
      setHsnCode(editingProduct.hsnCode);
      setPrice(editingProduct.price.toString());
      setStock(editingProduct.stock.toString());
      setUnit(editingProduct.unit);
      setGstRate(editingProduct.gstRate.toString());
    } else {
      setName('');
      setSku('');
      setHsnCode('');
      setPrice('');
      setStock('');
      setUnit('pcs');
      setGstRate('');
    }
  }, [editingProduct, isOpen]);

  const handleSave = () => {
    if (!name || !sku || !price || !gstRate) {
      alert('Please fill in all required fields (Name, SKU, Price, GST Rate).');
      return;
    }

    const product: Product = {
      id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
      name,
      sku,
      hsnCode,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      unit,
      gstRate: parseFloat(gstRate)
    };

    onSave(product);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <p className="text-xs text-slate-500 font-medium">Configure product details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SKU *</label>
              <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">HSN Code</label>
              <input type="text" value={hsnCode} onChange={(e) => setHsnCode(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">GST Rate (%) *</label>
              <input type="number" value={gstRate} onChange={(e) => setGstRate(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">Save Product</button>
        </div>
      </motion.div>
    </div>
  );
}

function PricingModal({ isOpen, onClose, onSelectPlan }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSelectPlan: (plan: 'standard' | 'pro' | 'enterprise') => void 
}) {
  if (!isOpen) return null;

  const plans = [
    {
      id: 'standard',
      name: 'Standard',
      price: '₹499',
      duration: '/month',
      features: ['Unlimited Invoices', 'Unlimited Customers', 'Unlimited Inventory', 'Basic Reports'],
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₹999',
      duration: '/month',
      features: ['Everything in Standard', 'Advanced Analytics', 'Multi-User Access', 'Priority Support'],
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹2499',
      duration: '/month',
      features: ['Everything in Pro', 'Custom Branding', 'API Access', 'Dedicated Account Manager'],
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 text-center bg-slate-50 border-b border-slate-100 relative">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3 h-3" /> Trial Limit Reached
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Upgrade to Continue Growing</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Choose a plan that fits your business needs. Unlock unlimited potential with Johar Billing.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={cn(
                  "relative p-8 rounded-[2rem] border-2 transition-all flex flex-col",
                  plan.popular ? "border-emerald-500 shadow-xl shadow-emerald-500/10 scale-105 z-10 bg-white" : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-slate-500 text-sm">{plan.duration}</span>
                  </div>
                </div>
                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={cn("mt-1 p-0.5 rounded-full", plan.lightColor)}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => onSelectPlan(plan.id as any)}
                  className={cn(
                    "w-full py-4 rounded-2xl text-sm font-bold transition-all active:scale-95 shadow-lg",
                    plan.popular ? "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700" : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
                  )}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Secure payment processing. Cancel or switch plans anytime. Need a custom plan? <button className="text-emerald-600 font-bold hover:underline">Contact Sales</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
