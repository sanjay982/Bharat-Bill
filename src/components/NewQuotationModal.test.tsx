import { render, screen, fireEvent } from '@testing-library/react';
import { NewQuotationModal } from './NewQuotationModal';
import { Product, Contact } from '../types';
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

describe('NewQuotationModal', () => {
  const onClose = vi.fn();
  const onSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <NewQuotationModal
        isOpen={true}
        onClose={onClose}
        products={mockProducts}
        contacts={mockContacts}
        activeTenantId="t1"
        onSave={onSave}
      />
    );

    expect(screen.getByText('Create New Quotation')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Quotation Number')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <NewQuotationModal
        isOpen={false}
        onClose={onClose}
        products={mockProducts}
        contacts={mockContacts}
        activeTenantId="t1"
        onSave={onSave}
      />
    );

    expect(screen.queryByText('Create New Quotation')).not.toBeInTheDocument();
  });

  it('allows adding items and selecting customer', async () => {
    render(
      <NewQuotationModal
        isOpen={true}
        onClose={onClose}
        products={mockProducts}
        contacts={mockContacts}
        activeTenantId="t1"
        onSave={onSave}
      />
    );

    // Select customer
    // Since there is no label association, we find the select by its options or just the first select
    const selects = screen.getAllByRole('combobox');
    const customerSelect = selects[0]; // Assuming customer select is first
    
    fireEvent.change(customerSelect, { target: { value: 'c1' } });
    expect(customerSelect).toHaveValue('c1');

    // Add item
    const addItemButton = screen.getByText('Add Line Item');
    fireEvent.click(addItemButton);

    // Check if item row is added
    // We expect a new row in the table body
    // The table has a header row, so we look for rows in tbody
    // Or just check if new inputs appeared
    
    // Select product
    // The product select is in the new row. It should be the second select in the document now (or later if more selects exist)
    const productSelect = screen.getAllByRole('combobox')[1]; // 0 is customer, 1 is product (in the row)
    
    fireEvent.change(productSelect, { target: { value: 'p1' } });
    expect(productSelect).toHaveValue('p1');
    
    // Save
    const saveButton = screen.getByText('Generate Quotation');
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalled();
    const savedQuotation = onSave.mock.calls[0][0];
    expect(savedQuotation.contactId).toBe('c1');
    expect(savedQuotation.items).toHaveLength(1);
    expect(savedQuotation.items[0].productId).toBe('p1');
    // Product 1 price is 100, GST 18%. Total should be 118.
    // 100 * 1 = 100. GST 18. Total 118.
    expect(savedQuotation.totalAmount).toBe(118);
  });

  it('shows alert if trying to save without customer or items', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(
      <NewQuotationModal
        isOpen={true}
        onClose={onClose}
        products={mockProducts}
        contacts={mockContacts}
        activeTenantId="t1"
        onSave={onSave}
      />
    );

    const saveButton = screen.getByText('Generate Quotation');
    fireEvent.click(saveButton);

    expect(alertMock).toHaveBeenCalledWith('Please select a customer and add at least one item.');
    expect(onSave).not.toHaveBeenCalled();
    
    alertMock.mockRestore();
  });
});
