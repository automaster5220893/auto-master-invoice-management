'use client';

import { useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Invoice } from '@/types';
// import { exportToPDF, shareInvoice } from '@/utils/exportUtils';
import { 
  X, 
  Download, 
  Share2, 
  Car, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram 
} from 'lucide-react';

interface InvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
  onExportPDF: (invoice: Invoice) => void;
  onShare: (invoice: Invoice) => void;
}

export default function InvoiceModal({ invoice, onClose, onExportPDF, onShare }: InvoiceModalProps) {
  const { workshopInfo } = useStore();
  const invoiceRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Invoice #{invoice.sNo}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onExportPDF(invoice)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
              <button
                onClick={() => onShare(invoice)}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="p-6" ref={invoiceRef}>
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
                    <p className="text-sm text-gray-600">S.No: {invoice.sNo}</p>
                    <p className="text-sm text-gray-600">Name: {invoice.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date: {invoice.date}</p>
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
                    {invoice.services.map((service, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2 text-gray-900">{service.description}</td>
                        <td className="px-4 py-2 text-center text-gray-900">PKR {service.rate.toFixed(2)}</td>
                        <td className="px-4 py-2 text-center text-gray-900">PKR {service.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="p-4 border-b">
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">TOTAL: PKR {invoice.total.toFixed(2)}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
