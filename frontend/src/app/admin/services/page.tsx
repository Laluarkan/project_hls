"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, X, FileText, Upload, Briefcase, AlignLeft } from 'lucide-react';
import { getAdminServices, addService, updateService, deleteService } from '@/lib/api';

export default function ServicesManagement() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // State Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingService, setEditingService] = useState<any>(null);
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getAdminServices();
      setServices(data);
    } catch (error) {
      console.error("Gagal mengambil data layanan", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [services, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '' });
    setImageFile(null);
    setImagePreview(null);
    setFormError('');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (imageFile) data.append('image_file', imageFile);

    try {
      await addService(data);
      setIsAddModalOpen(false);
      resetForm();
      fetchServices();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Gagal menambahkan layanan. Periksa kembali form Anda.');
    } finally {
      setFormLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditModal = (service: any) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
    });
    setImagePreview(getImageUrl(service.image_url));
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (imageFile) data.append('image_file', imageFile);

    try {
      await updateService(editingService.id, data);
      setIsEditModalOpen(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Gagal memperbarui layanan.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`Yakin ingin menghapus layanan "${title}"?`)) {
      try {
        await deleteService(id);
        fetchServices();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      } catch (error: any) {
        alert("Gagal menghapus layanan.");
      }
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return "https://images.unsplash.com/photo-1541888081180-28564f891d4d?q=80&w=200&auto=format&fit=crop";
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
    return `${baseUrl}${url}`;
  };

  if (loading) { return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hls-primary"></div></div>; }

  const renderFormFields = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><Briefcase className="w-4 h-4 mr-2 text-hls-primary"/>Judul Layanan</label>
        <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-hls-primary" placeholder="Misal: Mobilisasi Alat Berat" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><AlignLeft className="w-4 h-4 mr-2 text-hls-primary"/>Deskripsi Layanan</label>
        <textarea name="description" required rows={5} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-hls-primary text-sm" placeholder="Penjelasan detail mengenai layanan yang ditawarkan..."></textarea>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><Upload className="w-4 h-4 mr-2 text-hls-primary"/>Banner Layanan</label>
        <div className="flex items-center gap-5 bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
          <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
            {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <FileText className="w-10 h-10 text-gray-300" />}
          </div>
          <div className="flex-1">
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-hls-primary hover:file:bg-blue-100 cursor-pointer" />
            <p className="text-xs text-gray-400 mt-2">Pilih gambar visual untuk merepresentasikan layanan ini (Otomatis WebP).</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div><h1 className="text-2xl font-bold text-gray-900">Manage Services</h1><p className="text-sm text-gray-500 mt-1">Manage the logistic and rental services offered.</p></div>
        <button onClick={() => { resetForm(); setIsAddModalOpen(true); }} className="bg-hls-primary hover:bg-blue-900 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Add New Service
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-400" /></div>
            <input type="text" placeholder="Search services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-hls-primary bg-gray-50" />
          </div>
          <span className="text-sm text-gray-500 font-medium hidden sm:block">Total: {filteredServices.length} items</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium w-16">Banner</th>
                <th className="px-6 py-4 font-medium w-1/4">Service Title</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredServices.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Data layanan tidak ditemukan.</td></tr>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                filteredServices.map((item: any) => {
                  const validImageUrl = getImageUrl(item.image_url);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4"><div className="w-16 h-12 rounded overflow-hidden border border-gray-200 bg-gray-100"><img src={validImageUrl} alt={item.title} className="w-full h-full object-cover" /></div></td>
                      <td className="px-6 py-4 font-bold text-gray-900 whitespace-normal min-w-[200px]">{item.title}</td>
                      <td className="px-6 py-4 text-gray-600 whitespace-normal min-w-[300px]">
                        <p className="line-clamp-2">{item.description}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-1.5">
                          <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-hls-primary hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(item.id, item.title)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-gray-900">Add New Service</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="flex flex-col overflow-hidden">
              <div className="px-6 py-6 overflow-y-auto flex-1">
                {formError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium">{formError}</div>}
                {renderFormFields()}
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Batal</button>
                <button type="submit" disabled={formLoading} className="px-4 py-2 bg-hls-primary hover:bg-blue-900 text-white rounded-lg text-sm font-semibold transition-colors shadow-md disabled:opacity-70">
                  {formLoading ? 'Menyimpan...' : 'Simpan Layanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-gray-900">Edit Service</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="flex flex-col overflow-hidden">
              <div className="px-6 py-6 overflow-y-auto flex-1">
                {formError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium">{formError}</div>}
                {renderFormFields()}
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Batal</button>
                <button type="submit" disabled={formLoading} className="px-4 py-2 bg-hls-primary hover:bg-blue-900 text-white rounded-lg text-sm font-semibold transition-colors shadow-md disabled:opacity-70">
                  {formLoading ? 'Memperbarui...' : 'Perbarui Layanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}