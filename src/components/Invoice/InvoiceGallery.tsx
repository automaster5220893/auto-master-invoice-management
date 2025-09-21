'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Invoice } from '@/types';
import { format } from 'date-fns';
import { exportToPDF, shareInvoice } from '@/utils/exportUtils';
import { 
  Eye, 
  Download, 
  Share2, 
  Trash2, 
  Search,
  Calendar,
  User,
  DollarSign
} from 'lucide-react';
import InvoiceModal from './InvoiceModal';

export default function InvoiceGallery() {
  const { invoices, deleteInvoice } = useStore();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.sNo.includes(searchTerm) ||
    invoice.date.includes(searchTerm)
  );

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
    }
  };

  const handleExportPDF = async (invoice: Invoice) => {
    // Create a temporary element for PDF generation
    const tempElement = document.createElement('div');
    tempElement.innerHTML = generateInvoiceHTML(invoice);
    tempElement.style.position = 'absolute';
    tempElement.style.left = '-9999px';
    document.body.appendChild(tempElement);
    
    try {
      await exportToPDF(tempElement, invoice);
    } finally {
      document.body.removeChild(tempElement);
    }
  };

  const handleShare = async (invoice: Invoice) => {
    await shareInvoice(invoice);
  };

  const generateInvoiceHTML = (invoice: Invoice) => {
    const { workshopInfo } = useStore.getState();
    return `
      <div style="width: 800px; background: white; font-family: Arial, sans-serif;">
        <div style="background: #dc2626; color: white; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="display: flex; align-items: center;">
              <div style="margin-right: 15px;">🚗</div>
              <div>
                <h1 style="font-size: 24px; font-weight: bold; margin: 0;">${workshopInfo.name}</h1>
                <p style="font-size: 14px; opacity: 0.9; margin: 0;">-${workshopInfo.tagline}-</p>
              </div>
            </div>
            <div style="text-align: right; font-size: 12px;">
              <p style="margin: 0;">Reference No: ${workshopInfo.referenceNo}</p>
              <p style="margin: 0;">Vendor No: ${workshopInfo.vendorNo}</p>
              <p style="margin: 0;">STRN: ${workshopInfo.strn}</p>
            </div>
          </div>
          <div style="font-size: 12px;">
            <p style="margin: 0;">Services: ${workshopInfo.services.join(' | ')}</p>
          </div>
        </div>
        
        <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="font-size: 12px; color: #6b7280; margin: 0;">S.No: ${invoice.sNo}</p>
              <p style="font-size: 12px; color: #6b7280; margin: 0;">Name: ${invoice.customerName}</p>
            </div>
            <div>
              <p style="font-size: 12px; color: #6b7280; margin: 0;">Date: ${invoice.date}</p>
            </div>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #dc2626; color: white;">
              <th style="padding: 10px; text-align: left; border: 1px solid #dc2626;">DESCRIPTION</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #dc2626;">RATE</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #dc2626;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.services.map(service => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px; color: #111827;">${service.description}</td>
                <td style="padding: 10px; text-align: center; color: #111827;">PKR ${service.rate.toFixed(2)}</td>
                <td style="padding: 10px; text-align: center; color: #111827;">PKR ${service.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; justify-content: flex-end;">
            <div style="text-align: right;">
              <p style="font-size: 18px; font-weight: bold; margin: 0; color: #111827;">TOTAL: PKR ${invoice.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div style="background: #dc2626; color: white; padding: 20px;">
          <div style="text-align: center; margin-bottom: 15px;">
            <h3 style="font-weight: bold; font-size: 18px; margin: 0;">${workshopInfo.name}</h3>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📞</span>
              <span>${workshopInfo.contactPerson} ${workshopInfo.phone}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">✉️</span>
              <span>${workshopInfo.email}</span>
            </div>
            <div style="display: flex; align-items: center; grid-column: 1 / -1;">
              <span style="margin-right: 8px;">📍</span>
              <span>${workshopInfo.address}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📘</span>
              <span>${workshopInfo.facebook}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 8px;">📷</span>
              <span>${workshopInfo.instagram}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Invoice Gallery</h1>
          <div className="text-sm text-gray-600">
            Total Invoices: {invoices.length}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by customer name, S.No, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Invoices Grid */}
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No invoices found' : 'No invoices yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Create your first invoice to get started'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvoices.map((invoice: Invoice) => (
              <div key={invoice.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">S.No: {invoice.sNo}</p>
                      <p className="text-xs text-gray-600">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">PKR {invoice.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-medium">{invoice.customerName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>{invoice.services.length} service(s)</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewInvoice(invoice)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleExportPDF(invoice)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare(invoice)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteInvoice(invoice.id)}
                    className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {showModal && selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setShowModal(false)}
          onExportPDF={handleExportPDF}
          onShare={handleShare}
        />
      )}
    </div>
  );
}
