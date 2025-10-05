'use client';

import { useForm } from 'react-hook-form';
import { useStore } from '@/store/useStore';
import { WorkshopInfo } from '@/types';
import { Save, Building, Phone, Mail, MapPin, Facebook, Instagram, Trash2, RefreshCw } from 'lucide-react';
import { clearAllStorage } from '@/utils/clearStorage';
import { clearAllCaches, clearApiCache, forceRefresh } from '@/utils/clearCache';

export default function SettingsForm() {
  const { workshopInfo, updateWorkshopInfo, logout } = useStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<WorkshopInfo>({
    defaultValues: workshopInfo
  });

  const onSubmit = async (data: WorkshopInfo) => {
    const success = await updateWorkshopInfo(data);
    if (success) {
      alert('Settings updated successfully!');
    } else {
      alert('Failed to update settings. Please try again.');
    }
  };

  const handleClearAllData = async () => {
    if (confirm('Are you sure you want to clear all data? This will log you out and remove all stored information. This action cannot be undone.')) {
      await clearAllStorage();
      await logout();
      alert('All data cleared successfully. You have been logged out.');
      window.location.href = '/';
    }
  };

  const handleClearCache = async () => {
    if (confirm('Clear all cached data? This will force fresh data to be loaded from the server.')) {
      const success = await clearApiCache();
      if (success) {
        alert('Cache cleared successfully! The app will now load fresh data.');
        window.location.reload();
      } else {
        alert('Failed to clear cache. Please try again.');
      }
    }
  };

  const handleForceRefresh = () => {
    if (confirm('Force refresh the app? This will clear all caches and reload the page.')) {
      forceRefresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Building className="w-6 h-6 text-red-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Workshop Settings</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workshop Name
                </label>
                <input
                  {...register('name', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  {...register('tagline', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                {errors.tagline && <p className="text-red-500 text-sm mt-1">Tagline is required</p>}
              </div>
            </div>
          </div>

          {/* Business Numbers */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference No
                </label>
                <input
                  {...register('referenceNo', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                {errors.referenceNo && <p className="text-red-500 text-sm mt-1">Reference No is required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor No
                </label>
                <input
                  {...register('vendorNo', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                {errors.vendorNo && <p className="text-red-500 text-sm mt-1">Vendor No is required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  STRN
                </label>
                <input
                  {...register('strn', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                {errors.strn && <p className="text-red-500 text-sm mt-1">STRN is required</p>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    {...register('contactPerson', { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  {errors.contactPerson && <p className="text-red-500 text-sm mt-1">Contact Person is required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    {...register('phone', { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">Phone is required</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  {...register('address', { required: true })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">Address is required</p>}
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  {...register('facebook')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  {...register('instagram')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services (comma-separated)
              </label>
              <input
                {...register('services')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Denting, Painting, Mechanic, A.C, Auto Electrician, Computer Scanner"
              />
              <p className="text-sm text-gray-600 mt-1">
                Enter services separated by commas
              </p>
            </div>
          </div>

          {/* Cache Management */}
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cache Management</h2>
            <p className="text-sm text-gray-600 mb-4">
              If you're experiencing issues with data not updating (like new invoices not appearing), try these options:
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleClearCache}
                className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 font-medium rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear API Cache
              </button>
              <button
                type="button"
                onClick={handleForceRefresh}
                className="flex items-center px-4 py-2 text-orange-600 bg-orange-50 font-medium rounded-lg hover:bg-orange-100 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Force Refresh
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleClearAllData}
              className="flex items-center px-4 py-2 text-red-600 bg-red-50 font-medium rounded-lg hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Clear All Data
            </button>
            
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
