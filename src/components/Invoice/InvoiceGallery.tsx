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
    // Create a temporary element with the invoice HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = generateInvoiceHTML(invoice);
    tempElement.style.position = 'absolute';
    tempElement.style.left = '-9999px';
    tempElement.style.top = '-9999px';
    document.body.appendChild(tempElement);
    
    try {
      await shareInvoice(tempElement, invoice);
    } finally {
      document.body.removeChild(tempElement);
    }
  };

  const generateInvoiceHTML = (invoice: Invoice) => {
    const { workshopInfo } = useStore.getState();
    
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
    return `
      <div style="width: 800px; background: white; font-family: Arial, sans-serif;">
        <div style="background: #e52b28; color: white; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="display: flex; align-items: center;">
              <img src="/images/invoice_header_logo.png" alt="AUTO MASTER Logo" style="height: 80px; width: auto;" />
            </div>
            <div style="text-align: right; font-size: 12px;">
              <p style="margin: 0;">Reference No: ${currentWorkshopInfo.referenceNo}</p>
              <p style="margin: 0;">Vendor No: ${currentWorkshopInfo.vendorNo}</p>
              <p style="margin: 0;">STRN: ${currentWorkshopInfo.strn}</p>
            </div>
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
             <tr style="background: #e52b28; color: white;">
               <th style="padding: 10px; text-align: left; border: 1px solid #e52b28;">DESCRIPTION</th>
               <th style="padding: 10px; text-align: center; border: 1px solid #e52b28;">RATE</th>
               <th style="padding: 10px; text-align: center; border: 1px solid #e52b28;">AMOUNT</th>
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
        
        <div style="background: #e52b28; color: white; padding: 20px;">
          <div style="text-align: center; margin-bottom: 15px;">
            <h3 style="font-weight: bold; font-size: 18px; margin: 0;">${currentWorkshopInfo.name}</h3>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr>
              <td style="width: 50%; padding: 4px 5px 4px 0;">
                <div style="display: flex; align-items: center; line-height: 16px;">
                  <img src="/images/telephone.png" alt="Phone" style="width: 12px; height: 12px; margin-right: 8px; flex-shrink: 0;" />
                  <span style="margin-bottom: 12px;">${currentWorkshopInfo.contactPerson} ${currentWorkshopInfo.phone}</span>
                </div>
              </td>
              <td style="width: 50%; padding: 4px 0 4px 5px;">
                <div style="display: flex; align-items: center; line-height: 16px;">
                  <img src="/images/email.png" alt="Email" style="width: 12px; height: 12px; margin-right: 8px; flex-shrink: 0;" />
                  <span style="margin-bottom: 12px;">${currentWorkshopInfo.email}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 4px 0;">
                <div style="display: flex; align-items: center; line-height: 16px;">
                  <img src="/images/pin.png" alt="Location" style="width: 12px; height: 12px; margin-right: 8px; flex-shrink: 0;" />
                  <span style="margin-bottom: 12px;">${currentWorkshopInfo.address}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="width: 50%; padding: 4px 5px 4px 0;">
                <div style="display: flex; align-items: center; line-height: 16px;">
                  <img src="/images/facebook-app-symbol.png" alt="Facebook" style="width: 12px; height: 12px; margin-right: 8px; flex-shrink: 0;" />
                  <span style="margin-bottom: 12px;">${currentWorkshopInfo.facebook}</span>
                </div>
              </td>
              <td style="width: 50%; padding: 4px 0 4px 5px;">
                <div style="display: flex; align-items: center; line-height: 16px;">
                  <img src="/images/instagram.png" alt="Instagram" style="width: 12px; height: 12px; margin-right: 8px; flex-shrink: 0;" />
                  <span style="margin-bottom: 12px;">${currentWorkshopInfo.instagram}</span>
                </div>
              </td>
            </tr>
          </table>
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
