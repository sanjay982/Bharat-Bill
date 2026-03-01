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
  Filter
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
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Product, Contact, Invoice, View, InvoiceItem } from './types';
import { cn, formatCurrency, calculateGST } from './utils';

// Mock Data
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);

  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    const contact = contacts.find(c => c.id === invoice.contactId);
    
    // Header
    doc.setFontSize(20);
    doc.text('TAX INVOICE', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('BharatBill Solutions', 20, 40);
    doc.text('GSTIN: 27ABCDE1234F1Z5', 20, 45);
    doc.text('Mumbai, Maharashtra, India', 20, 50);
    
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
    
    (doc as any).autoTable({
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
    
    doc.save(`${invoice.invoiceNumber}.pdf`);
  };

  const renderCustomers = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-bottom border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Customers</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 w-full md:w-64"
            />
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors">
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
      <div className="p-6 border-bottom border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Invoices</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => setIsNewInvoiceModalOpen(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors"
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
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Printer className="w-4 h-4" /></button>
                    <button 
                      onClick={() => generatePDF(invoice)}
                      className="p-2 text-slate-400 hover:text-primary transition-colors"
                    >
                      <Download className="w-4 h-4" />
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

  const renderInventory = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-bottom border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Inventory</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 w-full md:w-64"
            />
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors">
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

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className={cn(
        "bg-primary text-white transition-all duration-300 flex flex-col fixed h-full z-50",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight">BharatBill</h1>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} collapsed={!isSidebarOpen} />
          <NavItem icon={<FileText />} label="Invoices" active={currentView === 'invoices'} onClick={() => setCurrentView('invoices')} collapsed={!isSidebarOpen} />
          <NavItem icon={<Package />} label="Inventory" active={currentView === 'inventory'} onClick={() => setCurrentView('inventory')} collapsed={!isSidebarOpen} />
          <NavItem icon={<Users />} label="Customers" active={currentView === 'customers'} onClick={() => setCurrentView('customers')} collapsed={!isSidebarOpen} />
          <NavItem icon={<ShoppingCart />} label="Purchases" active={false} onClick={() => {}} collapsed={!isSidebarOpen} />
          <div className="pt-4 pb-2">
            <div className={cn("h-px bg-white/10 mx-2", !isSidebarOpen && "hidden")} />
          </div>
          <NavItem icon={<Settings />} label="Settings" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} collapsed={!isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-white/10">
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
        "flex-1 transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800 capitalize">{currentView}</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Global Search..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 w-64"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
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
        <div className="p-8 max-w-7xl mx-auto w-full">
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
              {currentView === 'settings' && <div className="p-12 text-center text-slate-400">Settings Coming Soon</div>}
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
        onSave={(invoice) => {
          setInvoices([invoice, ...invoices]);
          setIsNewInvoiceModalOpen(false);
        }}
      />
    </div>
  );
}

function NavItem({ icon, label, active, onClick, collapsed }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, collapsed: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
        active ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-white/60 hover:bg-white/5 hover:text-white",
        collapsed && "justify-center px-0"
      )}
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

function NewInvoiceModal({ isOpen, onClose, products, contacts, onSave }: { 
  isOpen: boolean, 
  onClose: () => void, 
  products: Product[], 
  contacts: Contact[],
  onSave: (invoice: Invoice) => void 
}) {
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([]);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${format(new Date(), 'yyyy')}-${Math.floor(1000 + Math.random() * 9000)}`);

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9) }]);
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
            updatedItem.quantity = 1;
          }
        }
        
        if (updatedItem.price && updatedItem.quantity) {
          const { taxableAmount, gstAmount } = calculateGST(updatedItem.price, updatedItem.gstRate || 0, updatedItem.quantity);
          updatedItem.amount = taxableAmount;
          updatedItem.gstAmount = gstAmount;
        }
        
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
    if (!selectedContactId || items.length === 0) return;
    
    const newInvoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber,
      date: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      contactId: selectedContactId,
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
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold">Create New Invoice</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</label>
              <select 
                value={selectedContactId}
                onChange={(e) => setSelectedContactId(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Select Customer</option>
                {contacts.filter(c => c.type === 'customer').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice Number</label>
              <input 
                type="text" 
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Items</label>
              <button 
                onClick={addItem}
                className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:text-emerald-700"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-end bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="col-span-5 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Product</label>
                    <select 
                      value={item.productId || ''}
                      onChange={(e) => updateItem(item.id!, 'productId', e.target.value)}
                      className="w-full bg-white border-slate-200 rounded-lg text-sm"
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Qty</label>
                    <input 
                      type="number" 
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(item.id!, 'quantity', Number(e.target.value))}
                      className="w-full bg-white border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Price</label>
                    <input 
                      type="number" 
                      value={item.price || ''}
                      onChange={(e) => updateItem(item.id!, 'price', Number(e.target.value))}
                      className="w-full bg-white border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="col-span-2 text-right pb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total</p>
                    <p className="text-sm font-bold">{formatCurrency((item.amount || 0) + (item.gstAmount || 0))}</p>
                  </div>
                  <div className="col-span-1 flex justify-end pb-1">
                    <button 
                      onClick={() => removeItem(item.id!)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex gap-8">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subtotal</p>
              <p className="text-lg font-bold text-slate-700">{formatCurrency(subtotal)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total GST</p>
              <p className="text-lg font-bold text-slate-700">{formatCurrency(totalGst)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Grand Total</p>
              <p className="text-2xl font-black text-emerald-600">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
            >
              Save & Create
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
