import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invoice, User, WorkshopInfo } from '@/types';

interface AppState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;

  // Workshop Info
  workshopInfo: WorkshopInfo;
  updateWorkshopInfo: (info: Partial<WorkshopInfo>) => void;
}

const defaultWorkshopInfo: WorkshopInfo = {
  name: "AUTO MASTER",
  tagline: "MAINTENANCE CENTER",
  referenceNo: "5220893",
  vendorNo: "30305421",
  strn: "327787615816",
  contactPerson: "Latif Ur Rehman",
  phone: "0312-9790076",
  email: "latif2016@gmail.com",
  address: "Opposite Suzuki Motors Ring Road Peshawar",
  facebook: "accidentmaster",
  instagram: "Accident Master",
  services: ["Denting", "Painting", "Mechanic", "A.C", "Auto Electrician", "Computer Scanner"]
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Authentication
      user: null,
      isAuthenticated: false,

      login: (username: string, password: string) => {
        // Simple authentication - in production, this would be more secure
        if (username === "admin" && password === "admin123") {
          const user: User = {
            id: "1",
            username,
            email: "admin@automaster.com",
            isAuthenticated: true
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      // Invoices
      invoices: [],
      addInvoice: (invoice: Invoice) => {
        set((state) => ({
          invoices: [...state.invoices, invoice]
        }));
      },

      updateInvoice: (id: string, updatedInvoice: Partial<Invoice>) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
          )
        }));
      },

      deleteInvoice: (id: string) => {
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id)
        }));
      },

      getInvoice: (id: string) => {
        return get().invoices.find((invoice) => invoice.id === id);
      },

      // Workshop Info
      workshopInfo: defaultWorkshopInfo,
      updateWorkshopInfo: (info: Partial<WorkshopInfo>) => {
        set((state) => ({
          workshopInfo: { ...state.workshopInfo, ...info }
        }));
      }
    }),
    {
      name: 'auto-master-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        invoices: state.invoices,
        workshopInfo: state.workshopInfo
      })
    }
  )
);
