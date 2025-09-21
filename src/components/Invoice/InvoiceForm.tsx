'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { useStore } from '@/store/useStore';
import { Service } from '@/types';
import { Plus, Trash2, Save, Eye } from 'lucide-react';
import InvoicePreview from './InvoicePreview';

interface InvoiceFormData {
  customerName: string;
  services: Service[];
}

export default function InvoiceForm() {
  const [showPreview, setShowPreview] = useState(false);
  const { addInvoice, invoices } = useStore();
  
  const { control, register, handleSubmit, watch, setValue, reset } = useForm<InvoiceFormData>({
    defaultValues: {
      customerName: '',
      services: [{ id: uuidv4(), description: '', rate: 0, amount: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services'
  });

  const watchedServices = watch('services');

  const addService = () => {
    append({ id: uuidv4(), description: '', rate: 0, amount: 0 });
  };

  const removeService = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Update amounts when rates change
  useEffect(() => {
    watchedServices.forEach((service, index) => {
      const currentRate = service.rate || 0;
      setValue(`services.${index}.amount`, currentRate);
    });
  }, [watchedServices, setValue]);

  const onSubmit = (data: InvoiceFormData) => {
    const total = data.services.reduce((sum, service) => sum + (service.rate || 0), 0);
    const nextSNo = (invoices.length + 1).toString().padStart(3, '0');
    
    const newInvoice = {
      id: uuidv4(),
      sNo: nextSNo,
      customerName: data.customerName,
      date: format(new Date(), 'dd/MM/yyyy'),
      services: data.services.filter(service => service.description.trim() !== '').map(service => ({
        ...service,
        amount: service.rate || 0
      })),
      total,
      createdAt: new Date()
    };

    addInvoice(newInvoice);
    reset();
    alert('Invoice created successfully!');
  };

  const total = watchedServices.reduce((sum: number, service: Service) => sum + (service.rate || 0), 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Customer Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  {...register('customerName', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Enter customer name"
                />
              </div>

              {/* Services */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Services & Parts
                  </label>
                  <button
                    type="button"
                    onClick={addService}
                    className="flex items-center px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Service
                  </button>
                </div>

                <div className="space-y-3">
                  {fields.map((field: any, index: number) => (
                    <div key={field.id} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <input
                          {...register(`services.${index}.description` as const, { required: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                          placeholder="Service description or part name"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          {...register(`services.${index}.rate` as const, { 
                            required: true,
                            valueAsNumber: true
                          })}
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                          placeholder="Rate"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          value={watchedServices[index]?.rate || 0}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                          placeholder="Amount"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        disabled={fields.length === 1}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                  <span className="text-xl font-bold text-red-600">PKR {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Save className="w-5 h-5 mr-2" />
                Create Invoice
              </button>
            </form>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="lg:col-span-1">
              <InvoicePreview
                customerName={watch('customerName')}
                services={watchedServices}
                total={total}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
