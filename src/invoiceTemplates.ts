import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Invoice, Contact, BusinessProfile } from './types';
import { formatCurrency } from './utils';
import { format } from 'date-fns';

export type InvoiceTemplate = (doc: jsPDF, invoice: Invoice, contact: Contact | undefined, businessProfile: BusinessProfile) => void;

const applyHeader = (doc: jsPDF, invoice: Invoice, contact: Contact | undefined, businessProfile: BusinessProfile, title: string) => {
    doc.setFontSize(20);
    doc.text(title, 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(businessProfile.name, 20, 40);
    doc.text(`GSTIN: ${businessProfile.gstin}`, 20, 45);
    doc.text(businessProfile.address, 20, 50);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 140, 40);
    doc.text(`Date: ${format(new Date(invoice.date), 'dd/MM/yyyy')}`, 140, 45);
    doc.text('Bill To:', 20, 70);
    doc.text(contact?.name || 'Customer Name', 20, 75);
    doc.text(contact?.address || 'Address', 20, 80);
};

const applyBorder = (doc: jsPDF) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287);
};

const applyTable = (doc: jsPDF, invoice: Invoice, fillColor: [number, number, number]) => {
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
        headStyles: { fillColor }
    });
};

export const templates: Record<string, InvoiceTemplate> = {
    'modern-blue': (doc, invoice, contact, businessProfile) => {
        applyBorder(doc);
        applyHeader(doc, invoice, contact, businessProfile, 'TAX INVOICE');
        applyTable(doc, invoice, [0, 123, 255]);
    },
    'classic-green': (doc, invoice, contact, businessProfile) => {
        applyBorder(doc);
        applyHeader(doc, invoice, contact, businessProfile, 'TAX INVOICE');
        applyTable(doc, invoice, [16, 185, 129]);
    },
    'minimalist': (doc, invoice, contact, businessProfile) => {
        applyBorder(doc);
        applyHeader(doc, invoice, contact, businessProfile, 'INVOICE');
        applyTable(doc, invoice, [100, 100, 100]);
    },
    'bold-red': (doc, invoice, contact, businessProfile) => {
        applyBorder(doc);
        applyHeader(doc, invoice, contact, businessProfile, 'TAX INVOICE');
        applyTable(doc, invoice, [239, 68, 68]);
    },
    'elegant-gold': (doc, invoice, contact, businessProfile) => {
        applyBorder(doc);
        applyHeader(doc, invoice, contact, businessProfile, 'TAX INVOICE');
        applyTable(doc, invoice, [212, 175, 55]);
    },
    'tech-purple': (doc, invoice, contact, businessProfile) => {
        applyBorder(doc);
        applyHeader(doc, invoice, contact, businessProfile, 'TAX INVOICE');
        applyTable(doc, invoice, [139, 92, 246]);
    },
    'ocean-teal': (doc, invoice, contact, businessProfile) => {
        applyBorder(doc);
        applyHeader(doc, invoice, contact, businessProfile, 'TAX INVOICE');
        applyTable(doc, invoice, [20, 184, 166]);
    },
    'sunset-orange': (doc, invoice, contact, businessProfile) => {
        applyBorder(doc);
        applyHeader(doc, invoice, contact, businessProfile, 'TAX INVOICE');
        applyTable(doc, invoice, [249, 115, 22]);
    },
    'slate-grey': (doc, invoice, contact, businessProfile) => {
        applyBorder(doc);
        applyHeader(doc, invoice, contact, businessProfile, 'TAX INVOICE');
        applyTable(doc, invoice, [71, 85, 105]);
    },
    'royal-navy': (doc, invoice, contact, businessProfile) => {
        applyBorder(doc);
        applyHeader(doc, invoice, contact, businessProfile, 'TAX INVOICE');
        applyTable(doc, invoice, [30, 58, 138]);
    }
};
