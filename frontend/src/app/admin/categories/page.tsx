"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, X, Tags, AlignLeft } from 'lucide-react';
import { getAdminCategories, addCategory, updateCategory, deleteCategory } from '@/lib/api';

export default function CategoriesManagement() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // State Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (error) {
      console.error("Gagal mengambil data kategori", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [categories, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setFormError('');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      await addCategory(formData);
      setIsAddModalOpen(false);
      resetForm();
      fetchCategories();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Gagal menambahkan kategori.');
    } finally {
      setFormLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      await updateCategory(editingCategory.id, formData);
      setIsEditModalOpen(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Gagal memperbarui kategori.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Yakin ingin menghapus kategori "${name}"? Pastikan tidak ada armada yang menggunakan kategori ini.`)) {
      try {
        await deleteCategory(id);
        fetchCategories();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        alert(error.response?.data?.message || "Gagal menghapus kategori.");
      }
    }
  };

  if (loading) { return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hls-primary"></div></div>; }

  const renderFormFields = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><Tags className="w-4 h-4 mr-2 text-hls-primary"/>Nama Kategori</label>
        <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-hls-primary" placeholder="Misal: Excavator, Mobile Crane" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><AlignLeft className="w-4 h-4 mr-2 text-hls-primary"/>Deskripsi Kategori</label>
        <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-hls-primary text-sm" placeholder="Penjelasan singkat mengenai kategori ini..."></textarea>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div><h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1><p className="text-sm text-gray-500 mt-1">Organize your heavy equipment into distinct categories.</p></div>
        <button onClick={() => { resetForm(); setIsAddModalOpen(true); }} className="bg-hls-primary hover:bg-blue-900 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Add New Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-400" /></div>
            <input type="text" placeholder="Search category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-hls-primary bg-gray-50" />
          </div>
          <span className="text-sm text-gray-500 font-medium hidden sm:block">Total: {filteredCategories.length} items</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium w-1/4">Category Name</th>
                <th className="px-6 py-4 font-medium w-1/4">Slug</th>
                <th className="px-6 py-4 font-medium w-1/3">Description</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Data kategori tidak ditemukan.</td></tr>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                filteredCategories.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.slug}</td>
                    <td className="px-6 py-4 text-gray-600 whitespace-normal min-w-[200px]">{item.description || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-1.5">
                        <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-hls-primary hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id, item.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-gray-900">Add New Category</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="flex flex-col">
              <div className="px-6 py-6">
                {formError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium">{formError}</div>}
                {renderFormFields()}
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Batal</button>
                <button type="submit" disabled={formLoading} className="px-4 py-2 bg-hls-primary hover:bg-blue-900 text-white rounded-lg text-sm font-semibold transition-colors shadow-md disabled:opacity-70">
                  {formLoading ? 'Menyimpan...' : 'Simpan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-gray-900">Edit Category</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="flex flex-col">
              <div className="px-6 py-6">
                {formError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium">{formError}</div>}
                {renderFormFields()}
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Batal</button>
                <button type="submit" disabled={formLoading} className="px-4 py-2 bg-hls-primary hover:bg-blue-900 text-white rounded-lg text-sm font-semibold transition-colors shadow-md disabled:opacity-70">
                  {formLoading ? 'Memperbarui...' : 'Perbarui Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}