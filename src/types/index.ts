export interface Service {
  id: string;
  description: string;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  sNo: string;
  customerName: string;
  date: string;
  services: Service[];
  total: number;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
}

export interface WorkshopInfo {
  name: string;
  tagline: string;
  referenceNo: string;
  vendorNo: string;
  strn: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  services: string[];
}
