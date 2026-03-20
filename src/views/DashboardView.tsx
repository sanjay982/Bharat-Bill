import React from 'react';
import { motion } from 'motion/react';
import { StatCard } from '../components/StatCard';
import { IndianRupee, CreditCard, Package, Users, MessageSquare, FileText, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { cn, formatCurrency } from '../utils';
import { Invoice, Contact, View } from '../types';

interface DashboardViewProps {
  totalSales: number;
  totalReceivables: number;
  lowStockCount: number;
  contacts: Contact[];
  chartData: any[];
  invoices: Invoice[];
  setCurrentView: (view: View) => void;
  setIsFeedbackModalOpen: (open: boolean) => void;
}

export default function DashboardView({
  totalSales,
  totalReceivables,
  lowStockCount,
  contacts,
  chartData,
  invoices,
  setCurrentView,
  setIsFeedbackModalOpen
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Feedback Button */}
      <div className="flex justify-end">
        <button 
          onClick={() => setIsFeedbackModalOpen(true)}
          className="neo-button-primary px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2"
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
          className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 depth-card"
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
              <AreaChart data={chartData}>
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
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 depth-card"
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
}
