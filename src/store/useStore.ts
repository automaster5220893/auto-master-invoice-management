import { create } from 'zustand';
import { Invoice, User, WorkshopInfo, Service } from '@/types';
import Cookies from 'js-cookie';
import { clearAllStorage } from '@/utils/clearStorage';

interface AppState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  // register: (username: string, email: string, password: string) => Promise<boolean>; // Commented out - registration disabled
  logout: () => void;
  checkAuth: () => Promise<void>;

  // Invoices
  invoices: Invoice[];
  loading: boolean;
  fetchInvoices: () => Promise<void>;
  addInvoice: (invoiceData: { customerName: string; services: Service[] }) => Promise<boolean>;
  deleteInvoice: (id: string) => Promise<boolean>;
  getInvoice: (id: string) => Invoice | undefined;

  // Workshop Info
  workshopInfo: WorkshopInfo | null;
  fetchWorkshopInfo: () => Promise<void>;
  updateWorkshopInfo: (info: Partial<WorkshopInfo>) => Promise<boolean>;
}

const API_BASE = '/api';

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = Cookies.get('auth-token');
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Handle 401 Unauthorized - token expired
    if (response.status === 401) {
      // Clear authentication state
      Cookies.remove('auth-token');
      Cookies.remove('auth-token', { path: '/' });
      Cookies.remove('auth-token', { path: '/', domain: window.location.hostname });
      
      // Reset store state
      useStore.getState().logout();
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      
      throw new Error('Authentication expired. Please login again.');
    }
    
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const useStore = create<AppState>()((set, get) => ({
  // Authentication
  user: null,
  isAuthenticated: false,
  token: null,

  login: async (username: string, password: string) => {
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      const { token, user } = response;
      Cookies.set('auth-token', token, { expires: 7 });
      
      set({ 
        user: { ...user, isAuthenticated: true }, 
        isAuthenticated: true, 
        token 
      });
      
      // Fetch user data
      await get().fetchInvoices();
      await get().fetchWorkshopInfo();
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  // Registration function commented out - registration disabled
  /*
  register: async (username: string, email: string, password: string) => {
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      const { token, user } = response;
      Cookies.set('auth-token', token, { expires: 7 });
      
      set({ 
        user: { ...user, isAuthenticated: true }, 
        isAuthenticated: true, 
        token 
      });
      
      // Fetch user data
      await get().fetchInvoices();
      await get().fetchWorkshopInfo();
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  },
  */

  logout: async () => {
    try {
      // Call logout API to clear server-side session
      await apiCall('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.log('Logout API call failed:', error);
    }
    
    // Clear all browser storage
    await clearAllStorage();
    
    // Clear cookies using js-cookie as backup
    Cookies.remove('auth-token');
    Cookies.remove('auth-token', { path: '/' });
    Cookies.remove('auth-token', { path: '/', domain: window.location.hostname });
    
    // Reset store state
    set({ 
      user: null, 
      isAuthenticated: false, 
      token: null,
      invoices: [],
      workshopInfo: null,
      loading: false
    });
  },

  checkAuth: async () => {
    const token = Cookies.get('auth-token');
    console.log('checkAuth called, token exists:', !!token);
    
    if (token) {
      set({ token, isAuthenticated: true });
      // Fetch user data - these will handle their own errors
      try {
        console.log('Fetching invoices and workshop info...');
        await get().fetchInvoices();
        await get().fetchWorkshopInfo();
        console.log('Data fetch completed successfully');
      } catch (error) {
        // If fetching data fails due to auth issues, the apiCall function will handle logout
        console.log('Auth check failed, user will be logged out automatically:', error);
      }
    } else {
      // No token, ensure user is logged out
      console.log('No token found, clearing auth state');
      set({ 
        user: null, 
        isAuthenticated: false, 
        token: null,
        invoices: [],
        workshopInfo: null
      });
    }
  },

  // Invoices
  invoices: [],
  loading: false,

  fetchInvoices: async () => {
    try {
      console.log('fetchInvoices called');
      set({ loading: true });
      const invoices = await apiCall('/invoices');
      console.log('Invoices fetched successfully:', invoices.length, 'invoices');
      set({ invoices });
    } catch (error) {
      console.error('Fetch invoices error:', error);
      // If it's an authentication error, the apiCall function will handle logout
      // For other errors, show user-friendly message
      if (error instanceof Error && !error.message.includes('Authentication expired')) {
        alert('Failed to load invoices. Please try again.');
      }
      // Clear invoices on error to prevent showing stale data
      set({ invoices: [] });
    } finally {
      set({ loading: false });
    }
  },

  addInvoice: async (invoiceData: { customerName: string; services: Service[] }) => {
    try {
      const invoice = await apiCall('/invoices', {
        method: 'POST',
        body: JSON.stringify(invoiceData),
      });
      
      set((state) => ({
        invoices: [invoice, ...state.invoices]
      }));
      
      return true;
    } catch (error) {
      console.error('Add invoice error:', error);
      return false;
    }
  },

  deleteInvoice: async (id: string) => {
    try {
      await apiCall(`/invoices/${id}`, {
        method: 'DELETE',
      });
      
      set((state) => ({
        invoices: state.invoices.filter((invoice) => invoice.id !== id)
      }));
      
      return true;
    } catch (error) {
      console.error('Delete invoice error:', error);
      return false;
    }
  },

  getInvoice: (id: string) => {
    return get().invoices.find((invoice) => invoice.id === id);
  },

  // Workshop Info
  workshopInfo: null,

  fetchWorkshopInfo: async () => {
    try {
      const workshopInfo = await apiCall('/workshop');
      set({ workshopInfo });
    } catch (error) {
      console.error('Fetch workshop info error:', error);
      // If it's an authentication error, the apiCall function will handle logout
      // For other errors, show user-friendly message
      if (error instanceof Error && !error.message.includes('Authentication expired')) {
        alert('Failed to load workshop information. Please try again.');
      }
    }
  },

  updateWorkshopInfo: async (info: Partial<WorkshopInfo>) => {
    try {
      const workshopInfo = await apiCall('/workshop', {
        method: 'PUT',
        body: JSON.stringify(info),
      });
      
      set({ workshopInfo });
      return true;
    } catch (error) {
      console.error('Update workshop info error:', error);
      return false;
    }
  }
}));
