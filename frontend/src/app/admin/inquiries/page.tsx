"use client"

import React, { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Search, Filter, DownloadCloud, Eye, EyeOff, MessageSquare } from 'lucide-react';
import api from '@/lib/api';

export default function InquiriesManagement() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await api.get('/admin/inquiries');
        setInquiries(response.data);
      } catch (error) {
        console.error("Gagal mengambil data pesan", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleView = async (item: any) => {
    if (expandedId === item.id) {
      setExpandedId(null);
      return;
    }
    
    setExpandedId(item.id);

    if (item.status === 'unread') {
      try {
        await api.put(`/admin/inquiries/${item.id}/read`);
        
        setInquiries(prevInquiries => 
          prevInquiries.map(inq => 
            inq.id === item.id ? { ...inq, status: 'read' } : inq
          )
        );
      } catch (error) {
        console.error("Gagal memperbarui status pesan", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hls-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries Management</h1>
          <p className="text-sm text-gray-500 mt-1">Review and respond to messages from the public website.</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center flex-1 sm:flex-none">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
          <button className="bg-hls-primary hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center flex-1 sm:flex-none">
            <DownloadCloud className="w-4 h-4 mr-2" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-base font-bold text-gray-900">Recent Messages</h3>
          <span className="text-sm text-gray-500">Total: {inquiries.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Sender Name</th>
                <th className="px-6 py-4 font-medium">Email / Phone</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Belum ada pesan yang masuk.</td>
                </tr>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                inquiries.map((item: any) => {
                  const isUnread = item.status === 'unread';
                  const isExpanded = expandedId === item.id;
                  const date = new Date(item.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <React.Fragment key={item.id}>
                      <tr 
                        className={`transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}
                        onClick={() => handleView(item)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {isUnread && <span className="w-2 h-2 rounded-full bg-hls-primary mr-3"></span>}
                            <span className={`${isUnread ? 'font-bold text-gray-900' : 'text-gray-700'} ${!isUnread && 'ml-5'}`}>{item.sender_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className={`${isUnread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{item.email}</span>
                            <span className="text-xs text-gray-400">{item.phone}</span>
                          </div>
                        </td>
                        <td className={`px-6 py-4 ${isUnread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{item.subject}</td>
                        <td className="px-6 py-4">
                          {isUnread ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                              Unread
                            </span>
                          ) : item.status === 'replied' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                              Replied
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                              Read
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{date}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            className={`p-1.5 rounded-lg transition-colors ${isExpanded ? 'bg-hls-primary text-white' : 'text-gray-400 hover:text-hls-primary hover:bg-blue-50'}`}
                          >
                            {isExpanded ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr className="bg-blue-50/10">
                          <td colSpan={6} className="px-8 py-6 border-b border-gray-100">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-4">
                              <div className="bg-blue-50 text-hls-primary p-3 rounded-xl hidden sm:block">
                                <MessageSquare className="w-6 h-6" />
                              </div>
                              <div className="flex-1 w-full whitespace-normal">
                                <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Pesan Detail:</h4>
                                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                                  {item.message}
                                </p>
                                <div className="mt-4 flex justify-end">
                                   <button className="bg-hls-accent hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                     Balas via Email
                                   </button>
                                </div>
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
    </div>
  );
}