import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Invoice, Contact, BusinessProfile } from '../types';
import { templates } from '../invoiceTemplates';
import { formatCurrency } from '../utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  contact: Contact | undefined;
  businessProfile: BusinessProfile;
}

export const InvoicePreviewModal: React.FC<Props> = ({ isOpen, onClose, invoice, contact, businessProfile }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    console.log('InvoicePreviewModal useEffect', { isOpen, invoice, contact, businessProfile });
    if (isOpen) {
      try {
        const doc = new jsPDF();
        const template = templates[businessProfile.invoiceTemplateId || 'modern-blue'] || templates['modern-blue'];
        console.log('Template found:', !!template);
        template(doc, invoice, contact, businessProfile);
        
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
        
        const url = doc.output('datauristring');
        console.log('PDF generated, URL length:', url.length);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  }, [isOpen, invoice, contact, businessProfile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Invoice Preview</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">Close</button>
        </div>
        <div className="flex-1 overflow-hidden">
          {pdfUrl && <iframe src={pdfUrl} className="w-full h-full" />}
        </div>
      </div>
    </div>
  );
};
