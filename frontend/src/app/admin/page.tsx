"use client"

import { useState, useEffect } from 'react';
import { ArrowUpRight, Clock, CheckCircle2, AlertTriangle, DownloadCloud, MessageSquare, Truck } from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hls-primary"></div>
      </div>
    );
  }

  const metrics = data?.metrics || { new_inquiries: 0, total_equipments: 0, available_equipments: 0, maintenance_equipments: 0 };
  const recentInquiries = data?.recent_inquiries || [];

  const total = metrics.total_equipments || 1; 
  const availablePct = Math.round((metrics.available_equipments / total) * 100);
  const maintenancePct = Math.round((metrics.maintenance_equipments / total) * 100);

  const chartStyle = {
    background: `conic-gradient(#22c55e 0% ${availablePct}%, #ef4444 ${availablePct}% 100%)`
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Metrik real-time dan status operasional armada.</p>
        </div>
        <button className="bg-hls-primary hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center">
          <DownloadCloud className="w-4 h-4 mr-2" /> Export Laporan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-hls-primary rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Pesan Belum Dibaca</p>
          <h3 className="text-3xl font-bold text-gray-900">{metrics.new_inquiries}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-50 text-gray-600 rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Total Armada</p>
          <h3 className="text-3xl font-bold text-gray-900">{metrics.total_equipments}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Unit Tersedia</p>
          <h3 className="text-3xl font-bold text-green-600">{metrics.available_equipments}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Dalam Perawatan</p>
          <h3 className="text-3xl font-bold text-red-600">{metrics.maintenance_equipments}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
            <h3 className="text-base font-bold text-gray-900">Pesan Masuk Terbaru</h3>
            <a href="/admin/inquiries" className="text-sm font-semibold text-hls-primary hover:text-blue-800">Lihat Semua</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Pengirim</th>
                  <th className="px-6 py-3 font-medium">Subjek</th>
                  <th className="px-6 py-3 font-medium">Tanggal</th>
                  <th className="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Belum ada pesan masuk.</td>
                  </tr>
                ) : (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  recentInquiries.map((item: any) => {
                    const date = new Date(item.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className={`px-6 py-4 ${item.status === 'unread' ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{item.sender_name}</td>
                        <td className={`px-6 py-4 ${item.status === 'unread' ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{item.subject}</td>
                        <td className="px-6 py-4 text-gray-500">{date}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-hls-primary transition-colors">
                            <Clock className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-6">Status Armada</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            
            <div className="relative w-48 h-48 rounded-full flex items-center justify-center shadow-md overflow-hidden" style={chartStyle}>
              <div className="absolute inset-0 m-5 bg-white rounded-full flex items-center justify-center shadow-inner z-10">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-gray-900">{metrics.total_equipments}</span>
                  <span className="block text-xs text-gray-500 font-medium mt-1">Total Unit</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 w-full space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span><span className="text-gray-600">Tersedia</span></div>
                <span className="font-semibold text-gray-900">{metrics.available_equipments} ({availablePct}%)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span><span className="text-gray-600">Perawatan</span></div>
                <span className="font-semibold text-gray-900">{metrics.maintenance_equipments} ({maintenancePct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}