'use client';

import { useStore } from '@/store/useStore';
import { Service } from '@/types';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

interface InvoicePreviewProps {
  customerName: string;
  services: Service[];
  total: number;
}

export default function InvoicePreview({ customerName, services, total }: InvoicePreviewProps) {
  const { workshopInfo } = useStore();
  
  // Default workshop info if not loaded yet
  const defaultWorkshopInfo = {
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
  
  const currentWorkshopInfo = workshopInfo || defaultWorkshopInfo;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
      <div className="text-white p-4" style={{ backgroundColor: '#e52b28' }}>
        {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img 
                src="/images/invoice_header_logo.png" 
                alt="AUTO MASTER Logo" 
                className="h-20 w-auto"
              />
            </div>
            <div className="text-right text-sm">
              <p>Reference No: {currentWorkshopInfo.referenceNo}</p>
              <p>Vendor No: {currentWorkshopInfo.vendorNo}</p>
              <p>STRN: {currentWorkshopInfo.strn}</p>
            </div>
          </div>
      </div>

      {/* Customer Info */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">S.No: 487</p>
            <p className="text-sm text-gray-600">Name: {customerName || '________________'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="px-4 py-2 text-left">DESCRIPTION</th>
              <th className="px-4 py-2 text-center">RATE</th>
              <th className="px-4 py-2 text-center">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2 text-gray-900">{service.description || '________________'}</td>
                <td className="px-4 py-2 text-center text-gray-900">PKR {(service.rate || 0).toFixed(2)}</td>
                <td className="px-4 py-2 text-center text-gray-900">PKR {(service.rate || 0).toFixed(2)}</td>
              </tr>
            ))}
            {/* Empty rows for spacing */}
            {Array.from({ length: Math.max(0, 5 - services.length) }).map((_, index) => (
              <tr key={`empty-${index}`} className="border-b">
                <td className="px-4 py-2 h-8"></td>
                <td className="px-4 py-2 h-8"></td>
                <td className="px-4 py-2 h-8"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="p-4 border-b">
        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">TOTAL: PKR {total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-red-600 text-white p-4">
        <div className="text-center mb-3">
          <h3 className="font-bold text-lg">{currentWorkshopInfo.name}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            <span>{currentWorkshopInfo.contactPerson} {currentWorkshopInfo.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            <span>{currentWorkshopInfo.email}</span>
          </div>
          <div className="flex items-center md:col-span-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{currentWorkshopInfo.address}</span>
          </div>
          <div className="flex items-center">
            <Facebook className="w-4 h-4 mr-2" />
            <span>{currentWorkshopInfo.facebook}</span>
          </div>
          <div className="flex items-center">
            <Instagram className="w-4 h-4 mr-2" />
            <span>{currentWorkshopInfo.instagram}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
