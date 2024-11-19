import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Building, Trash2, Edit2, Plus } from 'lucide-react';
import { admin } from '../services/api';
import { toast } from 'react-toastify';

export default function AdminPanel() {
  const [organizations, setOrganizations] = useState([]);
  const [editingOrg, setEditingOrg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const { data } = await admin.getOrganizations();
      setOrganizations(data);
    } catch (error) {
      toast.error('Failed to fetch organizations');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingOrg) {
        await admin.updateOrganization(editingOrg.id, data);
        toast.success('Organization updated successfully');
      } else {
        await admin.createOrganization(data);
        toast.success('Organization created successfully');
      }
      setIsModalOpen(false);
      setEditingOrg(null);
      reset();
      fetchOrganizations();
    } catch (error) {
      toast.error('Failed to save organization');
    }
  };

  const handleDelete = async (orgId) => {
    try {
      await admin.deleteOrganization(orgId);
      toast.success('Organization deleted successfully');
      fetchOrganizations();
    } catch (error) {
      toast.error('Failed to delete organization');
    }
  };

  const openEditModal = (org) => {
    setEditingOrg(org);
    setValue('name', org.name);
    setValue('description', org.description);
    setValue('logo_url', org.logo_url);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Organizations Management</h1>
          <button
            onClick={() => {
              reset();
              setEditingOrg(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-800 hover:bg-green-900"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Organization
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-lg">
          <ul className="divide-y divide-gray-200">
            {organizations.map((org) => (
              <li key={org.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {org.logo_url ? (
                      <img
                        src={org.logo_url}
                        alt={org.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <Building className="h-12 w-12 text-gray-400" />
                    )}
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">{org.name}</h2>
                      <p className="text-sm text-gray-500">{org.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(org)}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(org.id)}
                      className="p-2 text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingOrg ? 'Edit Organization' : 'Add Organization'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    {...register('name', { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    {...register('description', { required: true })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                  <input
                    type="url"
                    {...register('logo_url')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingOrg(null);
                      reset();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900"
                  >
                    {editingOrg ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}