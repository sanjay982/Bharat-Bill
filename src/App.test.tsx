import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import App from './App';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signUp: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
    }
  }))
}));

vi.mock('./lib/supabase', () => {
  const mockFrom = () => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [], error: null }),
    update: vi.fn().mockResolvedValue({ data: [], error: null }),
    delete: vi.fn().mockResolvedValue({ data: [], error: null }),
    single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    then: vi.fn().mockImplementation((callback) => callback({ data: [], error: null })),
  });

  return {
    supabaseUrl: 'https://test.supabase.co',
    supabaseAnonKey: 'test-key',
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({ 
          data: { 
            session: { 
              user: { id: 'test-user', email: 'sanju13july@gmail.com' } 
            } 
          } 
        }),
        onAuthStateChange: vi.fn().mockReturnValue({ 
          data: { subscription: { unsubscribe: vi.fn() } } 
        }),
        signOut: vi.fn(),
        signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
        signUp: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
      },
      from: vi.fn().mockImplementation(mockFrom),
    },
  };
});

// Mock window.confirm
window.confirm = vi.fn(() => true);

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1200,
});

// Mock Recharts
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: any }) => (
      <div style={{ width: 800, height: 800 }}>{children}</div>
    ),
  };
});

describe('App Component', () => {
  it('renders dashboard by default', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Revenue Overview')).toBeInTheDocument();
    });
  });

  it('allows creating a new tenant', async () => {
    render(<App />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByText('Revenue Overview')).toBeInTheDocument();
    });

    // Navigate to Tenant Management
    const tenantLink = screen.getByText('Tenants');
    fireEvent.click(tenantLink);

    // Check if we are on Tenant Management page
    await waitFor(() => {
      expect(screen.getByText('Tenant Management')).toBeInTheDocument();
    });

    // Click New Tenant button
    const newTenantBtn = screen.getByText('New Tenant');
    fireEvent.click(newTenantBtn);

    // Check if modal is open
    expect(screen.getByText('Create New Tenant')).toBeInTheDocument();

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('e.g. Acme Corp'), { target: { value: 'Test Corp' } });
    fireEvent.change(screen.getByPlaceholderText('27ABCDE1234F1Z5'), { target: { value: '27TEST1234F1Z5' } });
    fireEvent.change(screen.getByPlaceholderText('contact@business.com'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter secure password'), { target: { value: 'password123' } });

    // Submit
    const createBtn = screen.getByText('Create Tenant');
    fireEvent.click(createBtn);

    // Check if tenant is added to the list
    await waitFor(() => {
      expect(screen.getByText('Test Corp')).toBeInTheDocument();
    });
  });

  it('renders quotations view', async () => {
    render(<App />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByText('Revenue Overview')).toBeInTheDocument();
    });

    // Navigate to Quotations
    const quotationsLink = screen.getByText('Quotations');
    fireEvent.click(quotationsLink);

    // Check if we are on Quotations page
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Quotations' })).toBeInTheDocument();
    });
  });
});
