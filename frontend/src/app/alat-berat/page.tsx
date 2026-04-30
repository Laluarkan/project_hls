"use client"

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import api, { getEquipments } from '@/lib/api';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Equipment {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  specifications: string;
  status: string;
  category_id: number;
  category_name?: string; 
}

// Fungsi Helper untuk memperbaiki path gambar lokal menjadi URL penuh backend
const getImageUrl = (url: string) => {
  if (!url) return "https://images.unsplash.com/photo-1579912440186-b489d873d611?q=80&w=600&auto=format&fit=crop";
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
  return `${baseUrl}${url}`;
};

export default function AlatBerat() {
  // State Data Database
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // State Filter Interaktif
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tarik data Alat Berat dan Kategori secara bersamaan dari backend
        const [eqData, catRes] = await Promise.all([
          getEquipments(),
          api.get('/categories') 
        ]);
        setEquipments(eqData || []);
        setCategories(catRes.data || []);
      } catch (error) {
        console.error("Gagal mengambil data katalog", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fungsi Logika Checkbox Kategori
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId) // Hapus jika sudah ada (uncheck)
        : [...prev, categoryId] // Tambah jika belum ada (check)
    );
  };

  // Fungsi Logika Checkbox Status
  const handleStatusChange = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Fungsi Reset Semua Filter
  const handleResetFilter = () => {
    setSelectedCategories([]);
    setSelectedStatuses([]);
  };

  // Proses Filter Secara Real-time (Otomatis menyaring saat checkbox diklik)
  const filteredEquipments = useMemo(() => {
    return equipments.filter(eq => {
      // Jika tidak ada kategori yang dipilih, tampilkan semua. Jika ada, cocokkan.
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(eq.category_id);
      // Sama halnya dengan status
      const matchStatus = selectedStatuses.length === 0 || selectedStatuses.includes(eq.status);
      
      return matchCategory && matchStatus;
    });
  }, [equipments, selectedCategories, selectedStatuses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hls-bg pt-28">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hls-primary"></div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-hls-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-hls-primary mb-4">Katalog Alat Berat</h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            Jelajahi armada alat berat kami yang dirawat dengan baik dan siap mendukung proyek konstruksi serta logistik Anda. Gunakan filter untuk menemukan spesifikasi yang tepat.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR FILTER (Kini Dinamis Berdasarkan Database) */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-hls-primary flex items-center">
                  Filter
                  <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                </h2>
                <span className="text-xs bg-blue-50 text-hls-primary px-2 py-1 rounded font-bold">{filteredEquipments.length} Unit</span>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Kategori Unit</h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryChange(cat.id)}
                        className="w-4 h-4 text-hls-primary rounded border-gray-300 focus:ring-hls-primary cursor-pointer" 
                      />
                      <span className="text-gray-600 text-sm group-hover:text-hls-primary transition-colors">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Status Ketersediaan</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedStatuses.includes('available')}
                      onChange={() => handleStatusChange('available')}
                      className="w-4 h-4 text-hls-primary rounded border-gray-300 focus:ring-hls-primary cursor-pointer" 
                    />
                    <span className="text-gray-600 text-sm group-hover:text-hls-primary transition-colors">Tersedia (Available)</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedStatuses.includes('maintenance')}
                      onChange={() => handleStatusChange('maintenance')}
                      className="w-4 h-4 text-hls-primary rounded border-gray-300 focus:ring-hls-primary cursor-pointer" 
                    />
                    <span className="text-gray-600 text-sm group-hover:text-hls-primary transition-colors">Dalam Perawatan</span>
                  </label>
                </div>
              </div>

              <button 
                onClick={handleResetFilter}
                className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 py-2.5 rounded-lg font-semibold text-sm transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipments.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  <p className="text-gray-500 text-lg font-medium">Tidak ada armada yang sesuai dengan filter Anda.</p>
                  <button onClick={handleResetFilter} className="mt-4 text-hls-primary font-bold hover:underline">Hapus Filter</button>
                </div>
              ) : (
                filteredEquipments.map((equipment: Equipment) => (
                  <div key={equipment.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={getImageUrl(equipment.image_url)} 
                        alt={equipment.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className={`absolute top-3 right-3 border px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                        equipment.status === 'available' 
                          ? 'bg-blue-50 border-blue-100 text-hls-primary' 
                          : 'bg-red-50 border-red-100 text-red-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${equipment.status === 'available' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
                        {equipment.status === 'available' ? 'Available' : 'Maintenance'}
                      </div>
                    </div>
                    
                    <div className="p-5 grow flex flex-col justify-between">
                      <div>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium mb-3">
                          {equipment.category_name || 'Heavy Equipment'}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{equipment.name}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                          {/* Parsing spesifikasi canggih agar rapi sesuai format di database baru */}
                          {equipment.specifications
                            .split('\n')
                            .map(line => line.replace(/\|/g, '').trim())
                            .filter(line => line !== '' && line.includes(':'))
                            .slice(0, 4)
                            .map((spec: string, index: number) => {
                              const parts = spec.split(':');
                              const label = parts[0];
                              const value = parts.slice(1).join(':');
                              return (
                                <div key={index}>
                                  <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">{label?.trim()}</p>
                                  <p className="font-semibold text-gray-800">{value?.trim() || '-'}</p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                        <div>
                           <p className="text-xs text-gray-500">Harga Sewa / Hari</p>
                           <p className="font-bold text-hls-primary text-sm">Hubungi Kami</p>
                        </div>
                        <Link 
                          href={`/alat-berat/${equipment.slug}`} 
                          className={`block w-full text-center text-white font-bold py-2 rounded-lg transition-colors ${equipment.status === 'available' ? 'bg-[#d94826] hover:bg-[#c03d1e]' : 'bg-gray-300 pointer-events-none'}`}
                        >
                          Inquire Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}