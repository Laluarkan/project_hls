'use client';

import { useState } from 'react';
import { submitInquiry } from '@/lib/api';

export default function InquiryButton({ 
  equipmentName, 
  equipmentId, 
  disabled 
}: { 
  equipmentName: string, 
  equipmentId: number, 
  disabled: boolean 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    sender_name: '',
    email: '',
    phone: '',
    company: '',
    subject: `Inquiry Sewa: ${equipmentName}`,
    message: `Halo, saya tertarik untuk menyewa ${equipmentName}. Mohon informasi lebih lanjut mengenai ketersediaan dan prosedurnya.`,
    equipment_id: equipmentId
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitInquiry(formData);
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      alert('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className={`px-8 py-3 rounded-lg font-bold text-white transition-all shadow-md hover:shadow-lg ${
          disabled 
            ? 'bg-gray-400 cursor-not-allowed shadow-none' 
            : 'bg-[#d94826] hover:bg-[#c03d1e]'
        }`}
      >
        Inquire Now
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="bg-[#1e3a5f] p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Permintaan Sewa</h2>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pesan Terkirim!</h3>
                  <p className="text-gray-600">Tim kami akan segera menghubungi Anda.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                    <p className="text-sm text-gray-500">Unit yang dipilih:</p>
                    <p className="font-bold text-gray-900">{equipmentName}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                      <input type="text" name="sender_name" required value={formData.sender_name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp *</label>
                      <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Perusahaan</label>
                      <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pesan / Detail Kebutuhan *</label>
                    <textarea name="message" required rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></textarea>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-[#1e3a5f] hover:bg-[#152a45] text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center">
                    {isSubmitting ? 'Mengirim...' : 'Kirim Permintaan'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}