'use client';

import { useStore } from '@/store/useStore';
import { Service } from '@/types';
import { Car, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

interface InvoicePreviewProps {
  customerName: string;
  services: Service[];
  total: number;
}

export default function InvoicePreview({ customerName, services, total }: InvoicePreviewProps) {
  const { workshopInfo } = useStore();

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-red-600 text-white p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Car className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">{workshopInfo.name}</h1>
              <p className="text-sm opacity-90">-{workshopInfo.tagline}-</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p>Reference No: {workshopInfo.referenceNo}</p>
            <p>Vendor No: {workshopInfo.vendorNo}</p>
            <p>STRN: {workshopInfo.strn}</p>
          </div>
        </div>

        {/* Services */}
        <div className="text-sm">
          <p>Services: {workshopInfo.services.join(' | ')}</p>
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
          <h3 className="font-bold text-lg">{workshopInfo.name}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            <span>{workshopInfo.contactPerson} {workshopInfo.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            <span>{workshopInfo.email}</span>
          </div>
          <div className="flex items-center md:col-span-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{workshopInfo.address}</span>
          </div>
          <div className="flex items-center">
            <Facebook className="w-4 h-4 mr-2" />
            <span>{workshopInfo.facebook}</span>
          </div>
          <div className="flex items-center">
            <Instagram className="w-4 h-4 mr-2" />
            <span>{workshopInfo.instagram}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
