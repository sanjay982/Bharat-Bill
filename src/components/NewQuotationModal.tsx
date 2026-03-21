import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, FileText, Calendar, Plus, Package, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Product, Contact, Quotation, InvoiceItem } from '../types';
import { formatCurrency, calculateGST } from '../utils';

interface NewQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  contacts: Contact[];
  activeTenantId: string;
  onSave: (quotation: Quotation) => void;
}

export function NewQuotationModal({ isOpen, onClose, products, contacts, activeTenantId, onSave }: NewQuotationModalProps) {
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([]);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [quotationNumber, setQuotationNumber] = useState(`QTN-${format(new Date(), 'yyyy')}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [validUntil, setValidUntil] = useState(format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));

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
            updatedItem.unit = product.unit;
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
    
    const newQuotation: Quotation = {
      id: Math.random().toString(36).substr(2, 9),
      quotationNumber,
      date: format(new Date(), 'yyyy-MM-dd'),
      validUntil,
      contactId: selectedContactId,
      tenantId: activeTenantId,
      items: items as InvoiceItem[],
      subtotal,
      totalGst,
      totalAmount,
      status: 'sent'
    };
    
    onSave(newQuotation);
    setItems([]);
    setSelectedContactId('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-2xl w-full max-w-5xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-white/20 overflow-hidden flex flex-col max-h-[95vh] depth-card"
      >
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-white/50 sticky top-0 z-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create New Quotation</h3>
            <p className="text-sm text-slate-500 font-medium">Generate a professional quotation</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-90 shadow-sm border border-slate-100">
            <X className="w-5 h-5 text-slate-400" />
          </button>
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
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quotation Number</label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={quotationNumber}
                  onChange={(e) => setQuotationNumber(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Valid Until</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="date" 
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quotation Items</h4>
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
                          <div className="relative">
                            <input 
                              type="number" 
                              min="1"
                              value={item.quantity || ''}
                              onChange={(e) => updateItem(item.id!, 'quantity', Number(e.target.value))}
                              className="w-full bg-white border-slate-200 rounded-lg text-sm focus:ring-emerald-500/20 focus:border-emerald-500 pr-12"
                            />
                            {item.unit && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {item.unit}
                              </span>
                            )}
                          </div>
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
                          <div className="relative">
                            <input 
                              type="number" 
                              min="1"
                              value={item.quantity || ''}
                              onChange={(e) => updateItem(item.id!, 'quantity', Number(e.target.value))}
                              className="w-full bg-white border-slate-200 rounded-lg text-sm focus:ring-emerald-500/20 focus:border-emerald-500 pr-12"
                            />
                            {item.unit && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {item.unit}
                              </span>
                            )}
                          </div>
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

        <div className="p-6 md:p-8 bg-slate-50/80 backdrop-blur-md border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 sticky bottom-0 z-10">
          <div className="flex flex-wrap gap-6 md:gap-10 justify-center md:justify-start w-full md:w-auto">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Subtotal</p>
              <p className="text-xl md:text-2xl font-black text-slate-700">{formatCurrency(subtotal)}</p>
            </div>
            <div className="space-y-1 text-center md:text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total GST</p>
              <p className="text-xl md:text-2xl font-black text-slate-700">{formatCurrency(totalGst)}</p>
            </div>
            <div className="space-y-1 text-center md:text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Grand Total</p>
              <p className="text-3xl md:text-4xl font-black text-emerald-600 drop-shadow-sm">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 md:flex-none px-8 py-4 rounded-2xl text-sm font-black text-slate-500 hover:bg-slate-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 md:flex-none px-12 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black shadow-[0_20px_40px_-12px_rgba(16,185,129,0.4)] hover:bg-emerald-700 hover:-translate-y-1 transition-all active:translate-y-0 active:scale-95"
            >
              Generate Quotation
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
