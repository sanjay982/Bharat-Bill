import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, FileText, Calendar, Plus, Package, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Product, Contact, Invoice, InvoiceItem } from '../types';
import { formatCurrency, calculateGST } from '../utils';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  contacts: Contact[];
  invoices: Invoice[];
  activeTenantId: string;
  onSave: (invoice: Invoice) => void;
}

export function NewInvoiceModal({ isOpen, onClose, products, contacts, invoices, activeTenantId, onSave }: NewInvoiceModalProps) {
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([]);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${format(new Date(), 'yyyy')}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueDate, setDueDate] = useState(format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [type, setType] = useState<'sale' | 'purchase' | 'credit_note' | 'debit_note'>('sale');
  const [originalInvoiceId, setOriginalInvoiceId] = useState('');

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
      date,
      dueDate,
      contactId: selectedContactId,
      tenantId: activeTenantId,
      items: items as InvoiceItem[],
      subtotal,
      totalGst,
      totalAmount,
      status: 'unpaid',
      type,
      originalInvoiceId: (type === 'credit_note' || type === 'debit_note') ? originalInvoiceId : undefined,
      invoiceType: contacts.find(c => c.id === selectedContactId)?.customerType || 'b2b'
    };
    
    onSave(newInvoice);
    setItems([]);
    setSelectedContactId('');
    setType('sale');
    setOriginalInvoiceId('');
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
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
              >
                <option value="sale">Sale Invoice</option>
                <option value="purchase">Purchase Invoice</option>
                <option value="credit_note">Credit Note</option>
                <option value="debit_note">Debit Note</option>
              </select>
            </div>
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
            {(type === 'credit_note' || type === 'debit_note') && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Original Invoice</label>
                <select 
                  value={originalInvoiceId}
                  onChange={(e) => setOriginalInvoiceId(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                >
                  <option value="">Select Invoice</option>
                  {invoices.filter(i => i.contactId === selectedContactId && (type === 'credit_note' ? i.type === 'sale' : i.type === 'purchase')).map(i => (
                    <option key={i.id} value={i.id}>{i.invoiceNumber} - {formatCurrency(i.totalAmount)}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {type === 'credit_note' ? 'Credit Note Number' : type === 'debit_note' ? 'Debit Note Number' : 'Invoice Number'}
              </label>
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
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
