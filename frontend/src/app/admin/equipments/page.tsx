"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, EyeOff, X, Package, DollarSign, Settings2, FileText, Upload } from 'lucide-react';
import api, { getAdminCategories, addEquipment, updateEquipment, deleteEquipment } from '@/lib/api';

export default function EquipmentsManagement() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [equipments, setEquipments] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingEquipment, setEditingEquipment] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    specifications: '',
    daily_rate: '',
    status: 'available',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eqRes, catRes] = await Promise.all([
        api.get('/admin/equipments'),
        getAdminCategories()
      ]);
      setEquipments(eqRes.data);
      setCategories(catRes);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipments = useMemo(() => {
    return equipments.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryNameMatch = item.category_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const idMatch = `EQ-${item.id.toString().padStart(4, '0')}`.includes(searchTerm);
      const searchMatch = nameMatch || categoryNameMatch || idMatch;

      const statusMatch = statusFilter === 'all' || item.status === statusFilter;
      const categoryMatch = categoryFilter === 'all' || item.category_id.toString() === categoryFilter;

      return searchMatch && statusMatch && categoryMatch;
    });
  }, [equipments, searchTerm, statusFilter, categoryFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    setFormData({
      category_id: '',
      name: '',
      // Template default sekarang menggunakan baris baru yang rapi
      specifications: 'Merk: \nTipe: \nTahun: \nKapasitas: \nBahan Bakar: ', 
      daily_rate: '',
      status: 'available',
    });
    setImageFile(null);
    setImagePreview(null);
    setFormError('');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    const data = new FormData();
    data.append('category_id', formData.category_id);
    data.append('name', formData.name);
    data.append('specifications', formData.specifications);
    data.append('daily_rate', formData.daily_rate);
    data.append('status', formData.status);
    if (imageFile) data.append('image_file', imageFile);

    try {
      await addEquipment(data);
      setIsAddModalOpen(false);
      resetForm();
      fetchData(); 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Gagal menambahkan alat. Periksa validasi.');
    } finally {
      setFormLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditModal = (equipment: any) => {
    setEditingEquipment(equipment);
    setFormData({
      category_id: equipment.category_id.toString(),
      name: equipment.name,
      // Bersihkan tanda pipa lama saat akan diedit
      specifications: equipment.specifications.replace(/\|/g, '').trim(),
      daily_rate: equipment.daily_rate.toString(),
      status: equipment.status,
    });
    setImagePreview(getImageUrl(equipment.image_url));
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    const data = new FormData();
    data.append('category_id', formData.category_id);
    data.append('name', formData.name);
    data.append('specifications', formData.specifications);
    data.append('daily_rate', formData.daily_rate);
    data.append('status', formData.status);
    if (imageFile) data.append('image_file', imageFile);

    try {
      await updateEquipment(editingEquipment.id, data);
      setIsEditModalOpen(false);
      setEditingEquipment(null);
      resetForm();
      fetchData(); 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Gagal memperbarui alat.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        await deleteEquipment(id);
        fetchData(); 
      } catch (error) {
        alert("Gagal menghapus alat.");
        console.error(error);
      }
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return "https://images.unsplash.com/photo-1579912440186-b489d873d611?q=80&w=200&auto=format&fit=crop";
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
    return `${baseUrl}${url}`;
  };

  if (loading) { return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hls-primary"></div></div>; }

  const renderFormFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><Package className="w-4 h-4 mr-2 text-hls-primary"/>Nama Alat Berat</label>
          <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-hls-primary" placeholder="Misal: Caterpillar 320D" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><Filter className="w-4 h-4 mr-2 text-hls-primary"/>Kategori</label>
          <select name="category_id" required value={formData.category_id} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-hls-primary text-sm bg-white">
            <option value="">Pilih Kategori...</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><DollarSign className="w-4 h-4 mr-2 text-hls-primary"/>Harga Sewa / Hari (Rp)</label>
          <input type="number" name="daily_rate" required min="0" value={formData.daily_rate} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-hls-primary" placeholder="Misal: 1500000" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><Settings2 className="w-4 h-4 mr-2 text-hls-primary"/>Status Awal</label>
          <select name="status" required value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-hls-primary text-sm bg-white">
            <option value="available">Tersedia (Available)</option>
            <option value="maintenance">Perawatan (Maintenance)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><FileText className="w-4 h-4 mr-2 text-hls-primary"/>Spesifikasi Teknik</label>
        <textarea name="specifications" required rows={6} value={formData.specifications} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-hls-primary text-sm font-mono" placeholder="Merk: Caterpillar&#10;Tahun: 2020&#10;Kapasitas: 20 Ton"></textarea>
        <p className="text-xs text-gray-400 mt-1.5">Tulis satu spesifikasi per baris. Pisahkan label dan nilai menggunakan titik dua (:).</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><Upload className="w-4 h-4 mr-2 text-hls-primary"/>Foto Alat (Otomatis WebP & Kompres)</label>
        <div className="flex items-center gap-5 bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
          <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
            {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <Package className="w-10 h-10 text-gray-300" />}
          </div>
          <div className="flex-1">
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-hls-primary hover:file:bg-blue-100 cursor-pointer" />
            <p className="text-xs text-gray-400 mt-2">Max 5MB (JPG, PNG, WEBP). Server akan mengubahnya menjadi WebP hemat ruang.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div><h1 className="text-2xl font-bold text-gray-900">Manage Equipments</h1><p className="text-sm text-gray-500 mt-1">View, track, and manage all heavy machinery.</p></div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button onClick={() => { resetForm(); setIsAddModalOpen(true); }} className="bg-hls-primary hover:bg-blue-900 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center flex-1 sm:flex-none">
            <Plus className="w-4 h-4 mr-2" /> Add New Equipment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-400" /></div>
            <input type="text" placeholder="Live search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-hls-primary bg-gray-50" />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-hls-primary">
              <option value="all">Semua Kategori</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-hls-primary">
              <option value="all">Semua Status</option>
              <option value="available">Tersedia</option>
              <option value="maintenance">Perawatan</option>
            </select>
            <span className="text-sm text-gray-500 font-medium ml-auto md:ml-0">Total: {filteredEquipments.length}</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Equipment Info</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Daily Rate</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEquipments.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Data alat berat tidak ditemukan.</td></tr>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                filteredEquipments.map((item: any) => {
                  const isExpanded = expandedId === item.id;
                  const validImageUrl = getImageUrl(item.image_url);

                  return (
                    <React.Fragment key={item.id}>
                      <tr className={`transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`} onClick={() => setExpandedId(isExpanded ? null : item.id)}>
                        <td className="px-6 py-4"><div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-100"><img src={validImageUrl} alt={item.name} className="w-full h-full object-cover" /></div></td>
                        <td className="px-6 py-4"><div className="flex flex-col"><span className="font-bold text-gray-900 text-base">{item.name}</span><span className="text-xs text-gray-500 mt-1 uppercase tracking-wide">ID: EQ-{item.id.toString().padStart(4, '0')}</span></div></td>
                        <td className="px-6 py-4"><span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{item.category_name || 'Uncategorized'}</span></td>
                        <td className="px-6 py-4 font-medium text-gray-900">Rp {Number(item.daily_rate).toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4">
                          {item.status === 'available' 
                            ? <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span> Available</span>
                            : <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span> Maintenance</span>
                          }
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setExpandedId(isExpanded ? null : item.id)} className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-hls-primary text-white' : 'text-gray-400 hover:text-hls-primary hover:bg-blue-50'}`}>{isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                            <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-hls-primary hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(item.id, item.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-blue-50/10">
                          <td colSpan={6} className="px-8 py-5 border-b border-gray-100 whitespace-normal">
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                              <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center"><FileText className="w-4 h-4 mr-2 text-hls-primary"/>Spesifikasi Teknik</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm bg-gray-50 p-5 rounded-lg border border-gray-100">
                                {item.specifications
                                  // Mengatasi data lama yang menggunakan '|' dan data baru yang menggunakan '\n'
                                  .split('\n')
                                  .map((line: string) => line.replace(/\|/g, '').trim())
                                  .filter((line: string) => line !== '')
                                  .map((spec: string, i: number) => {
                                    if (spec.includes(':')) {
                                      const parts = spec.split(':');
                                      const label = parts[0];
                                      const value = parts.slice(1).join(':').trim();
                                      return (
                                        <div key={i} className="flex flex-col space-y-1">
                                          <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{label.trim()}</span> 
                                          <span className="font-medium text-gray-900">{value || '-'}</span>
                                        </div>
                                      );
                                    } else {
                                      return <div key={i} className="col-span-full text-gray-800">{spec}</div>;
                                    }
                                  })}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
              <h3 className="text-xl font-bold text-gray-900">Add New Equipment</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="flex flex-col overflow-hidden">
              <div className="px-6 py-6 overflow-y-auto flex-1">
                {formError && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium">{formError}</div>}
                {renderFormFields()}
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Batal</button>
                <button type="submit" disabled={formLoading} className="px-5 py-2.5 bg-hls-primary hover:bg-blue-900 text-white rounded-lg text-sm font-semibold transition-colors flex items-center shadow-md disabled:opacity-70">
                  {formLoading ? 'Memproses...' : 'Simpan Armada'}
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
              <h3 className="text-xl font-bold text-gray-900">Edit Equipment: {editingEquipment?.name}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="flex flex-col overflow-hidden">
              <div className="px-6 py-6 overflow-y-auto flex-1">
                {formError && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium">{formError}</div>}
                {renderFormFields()}
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Batal</button>
                <button type="submit" disabled={formLoading} className="px-5 py-2.5 bg-hls-primary hover:bg-blue-900 text-white rounded-lg text-sm font-semibold transition-colors flex items-center shadow-md disabled:opacity-70">
                  {formLoading ? 'Memproses...' : 'Perbarui Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}