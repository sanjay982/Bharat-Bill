import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, IndianRupee } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { formatCurrency } from '../utils';

interface ReportsViewProps {
  invoices: any[];
  products: any[];
}

export default function ReportsView({ invoices, products }: ReportsViewProps) {
  const totalSales = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalGst = invoices.reduce((sum, inv) => sum + inv.totalGst, 0);
  
  const salesByCategory = React.useMemo(() => {
    const categorySales: Record<string, number> = {};
    invoices.forEach(invoice => {
      invoice.items.forEach((item: any) => {
        const product = products.find(p => p.id === item.productId);
        const category = product ? 'Electronics' : 'Other'; // Simplified for now
        categorySales[category] = (categorySales[category] || 0) + item.amount;
      });
    });
    return Object.entries(categorySales).map(([name, value]) => ({ name, value }));
  }, [invoices, products]);

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Business Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Total Sales</p>
          <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Total GST Collected</p>
          <p className="text-2xl font-bold">{formatCurrency(totalGst)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={salesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
