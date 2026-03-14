import { render, screen, fireEvent } from '@testing-library/react';
import { NewInvoiceModal } from './NewInvoiceModal';
import { Product, Contact, Invoice } from '../types';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Mock motion/react to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

const mockProducts: Product[] = [
  { id: 'p1', name: 'Product 1', price: 100, gstRate: 18, sku: 'SKU1', hsnCode: '1234', stock: 10, unit: 'pcs', tenantId: 't1' },
  { id: 'p2', name: 'Product 2', price: 200, gstRate: 12, sku: 'SKU2', hsnCode: '5678', stock: 20, unit: 'pcs', tenantId: 't1' },
];

const mockContacts: Contact[] = [
  { id: 'c1', name: 'Customer 1', email: 'c1@example.com', phone: '1234567890', type: 'customer', tenantId: 't1', address: 'Address 1', customerType: 'b2b' },
  { id: 'c2', name: 'Customer 2', email: 'c2@example.com', phone: '0987654321', type: 'customer', tenantId: 't1', address: 'Address 2', customerType: 'b2c' },
];

const mockInvoices: Invoice[] = [
  {
    id: 'i1',
    invoiceNumber: 'INV-001',
    date: '2024-03-01',
    dueDate: '2024-03-15',
    contactId: 'c1',
    tenantId: 't1',
    items: [
      { id: 'item1', productId: 'p1', name: 'Product 1', hsnCode: '1234', quantity: 1, price: 100, gstRate: 18, amount: 100, gstAmount: 18 }
    ],
    subtotal: 100,
    totalGst: 18,
    totalAmount: 118,
    status: 'paid',
    type: 'sale'
  }
];

describe('NewInvoiceModal', () => {
  const onClose = vi.fn();
  const onSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <NewInvoiceModal
        isOpen={true}
        onClose={onClose}
        products={mockProducts}
        contacts={mockContacts}
        invoices={mockInvoices}
        activeTenantId="t1"
        onSave={onSave}
      />
    );

    expect(screen.getByText('Create New Invoice')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Invoice Number')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <NewInvoiceModal
        isOpen={false}
        onClose={onClose}
        products={mockProducts}
        contacts={mockContacts}
        invoices={mockInvoices}
        activeTenantId="t1"
        onSave={onSave}
      />
    );

    expect(screen.queryByText('Create New Invoice')).not.toBeInTheDocument();
  });

  it('allows adding items and selecting customer', async () => {
    render(
      <NewInvoiceModal
        isOpen={true}
        onClose={onClose}
        products={mockProducts}
        contacts={mockContacts}
        invoices={mockInvoices}
        activeTenantId="t1"
        onSave={onSave}
      />
    );

    // Select customer
    const selects = screen.getAllByRole('combobox');
    const customerSelect = selects[1]; // Type is 0, Customer is 1
    
    fireEvent.change(customerSelect, { target: { value: 'c1' } });
    expect(customerSelect).toHaveValue('c1');

    // Add item
    const addItemButton = screen.getByText('Add Line Item');
    fireEvent.click(addItemButton);

    // Select product
    const productSelect = screen.getAllByRole('combobox')[2]; // Type, Customer, Product
    
    fireEvent.change(productSelect, { target: { value: 'p1' } });
    expect(productSelect).toHaveValue('p1');
    
    // Save
    const saveButton = screen.getByText('Generate');
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalled();
    const savedInvoice = onSave.mock.calls[0][0];
    expect(savedInvoice.contactId).toBe('c1');
    expect(savedInvoice.items).toHaveLength(1);
    expect(savedInvoice.items[0].productId).toBe('p1');
    expect(savedInvoice.totalAmount).toBe(118);
  });

  it('shows alert if trying to save without customer or items', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(
      <NewInvoiceModal
        isOpen={true}
        onClose={onClose}
        products={mockProducts}
        contacts={mockContacts}
        invoices={mockInvoices}
        activeTenantId="t1"
        onSave={onSave}
      />
    );

    const saveButton = screen.getByText('Generate');
    fireEvent.click(saveButton);

    expect(alertMock).toHaveBeenCalledWith('Please select a customer and add at least one item.');
    expect(onSave).not.toHaveBeenCalled();
    
    alertMock.mockRestore();
  });

  it('allows creating a credit note', async () => {
    render(
      <NewInvoiceModal
        isOpen={true}
        onClose={onClose}
        products={mockProducts}
        contacts={mockContacts}
        invoices={mockInvoices}
        activeTenantId="t1"
        onSave={onSave}
      />
    );

    // Select Document Type
    const typeSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(typeSelect, { target: { value: 'credit_note' } });

    // Select customer
    const customerSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(customerSelect, { target: { value: 'c1' } });

    // Select original invoice
    const originalInvoiceSelect = screen.getAllByRole('combobox')[2];
    fireEvent.change(originalInvoiceSelect, { target: { value: 'i1' } });

    // Add item
    const addItemButton = screen.getByText('Add Line Item');
    fireEvent.click(addItemButton);

    // Select product
    const productSelect = screen.getAllByRole('combobox')[3];
    fireEvent.change(productSelect, { target: { value: 'p1' } });
    
    // Save
    const saveButton = screen.getByText('Generate');
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalled();
    const savedInvoice = onSave.mock.calls[0][0];
    expect(savedInvoice.type).toBe('credit_note');
    expect(savedInvoice.originalInvoiceId).toBe('i1');
  });
});
