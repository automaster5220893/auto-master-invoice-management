import { create } from 'zustand';
import { Invoice, User, WorkshopInfo } from '@/types';
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
  checkAuth: () => void;

  // Invoices
  invoices: Invoice[];
  loading: boolean;
  fetchInvoices: () => Promise<void>;
  addInvoice: (invoiceData: { customerName: string; services: any[] }) => Promise<boolean>;
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
    throw new Error(`API call failed: ${response.statusText}`);
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

  checkAuth: () => {
    const token = Cookies.get('auth-token');
    if (token) {
      set({ token, isAuthenticated: true });
      // Fetch user data
      get().fetchInvoices();
      get().fetchWorkshopInfo();
    }
  },

  // Invoices
  invoices: [],
  loading: false,

  fetchInvoices: async () => {
    try {
      set({ loading: true });
      const invoices = await apiCall('/invoices');
      set({ invoices });
    } catch (error) {
      console.error('Fetch invoices error:', error);
    } finally {
      set({ loading: false });
    }
  },

  addInvoice: async (invoiceData: { customerName: string; services: any[] }) => {
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
