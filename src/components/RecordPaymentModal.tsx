import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, CreditCard, Calendar, DollarSign } from 'lucide-react';
import { Invoice, Payment } from '../types';
import { formatCurrency } from '../utils';
import { cn } from '../utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onSave: (payment: Omit<Payment, 'id' | 'tenantId'>) => void;
}

export const RecordPaymentModal: React.FC<Props> = ({ isOpen, onClose, invoice, onSave }) => {
  const [amount, setAmount] = useState(invoice?.totalAmount?.toString() || '');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'bank_transfer' | 'pos'>('cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen || !invoice) return null;

  const handleSave = () => {
    onSave({
      invoiceId: invoice.id,
      amount: parseFloat(amount),
      paymentDate,
      paymentMethod,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Record Payment</h3>
            <p className="text-xs text-slate-500 font-medium">Invoice #{invoice.invoiceNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Paid *</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Method *</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium">
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="pos">POS Machine</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Date *</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">Record Payment</button>
        </div>
      </motion.div>
    </div>
  );
};
