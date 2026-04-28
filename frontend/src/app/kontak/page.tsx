"use client"

import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send } from 'lucide-react';
import { submitInquiry } from '@/lib/api';

export default function Kontak() {
  const [formData, setFormData] = useState({
    sender_name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await submitInquiry(formData);
      setStatus('success');
      // Kosongkan form setelah berhasil
      setFormData({
        sender_name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Kembalikan status ke idle setelah 5 detik
      setTimeout(() => setStatus('idle'), 5000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.response?.data?.message || 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
    }
  };

  return (
    <div className="pt-32 pb-24 bg-hls-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-hls-primary mb-4">Hubungi Kami</h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            Tim HLS Transport siap membantu kebutuhan sewa alat berat dan logistik proyek Anda. Silakan isi formulir di bawah atau hubungi saluran resmi kami.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* FORMULIR KONTAK */}
          <div className="w-full lg:w-2/3 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            {status === 'success' && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <div>
                  <h4 className="font-bold">Pesan Terkirim!</h4>
                  <p className="text-sm">Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="sender_name"
                    required
                    value={formData.sender_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-hls-primary focus:border-transparent outline-none transition-all"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon</label>
                  <input 
                    type="text" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-hls-primary focus:border-transparent outline-none transition-all"
                    placeholder="+62 8xx xxxx xxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-hls-primary focus:border-transparent outline-none transition-all"
                    placeholder="email@perusahaan.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subjek Pesan</label>
                  <input 
                    type="text" 
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-hls-primary focus:border-transparent outline-none transition-all"
                    placeholder="Misal: Penawaran Sewa Excavator"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan Detail</label>
                <textarea 
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-hls-primary focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Jelaskan kebutuhan proyek, durasi, atau pertanyaan spesifik Anda..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-hls-primary hover:bg-blue-900 text-white py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center disabled:opacity-70"
              >
                {status === 'loading' ? 'Mengirim Pesan...' : (
                  <>Kirim Pesan <Send className="w-5 h-5 ml-2" /></>
                )}
              </button>
            </form>
          </div>

          {/* INFO KONTAK CARD */}
          <div className="w-full lg:w-1/3 space-y-6">
            
            {/* Hotline Card */}
            <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl flex flex-col md:flex-row lg:flex-col items-start gap-4">
              <div className="bg-hls-primary text-white p-4 rounded-2xl shrink-0">
                <Phone className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-hls-primary mb-2">Marketing Hotline</h3>
                <p className="text-gray-600 text-sm mb-4">Untuk penyewaan dan negosiasi kontrak dengan respon cepat.</p>
                <p className="text-xl font-bold text-hls-primary">+62 823-4106-5511</p>
              </div>
            </div>

            {/* Other Info Card */}
            <div className="bg-white border border-gray-100 p-8 rounded-3xl space-y-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 text-hls-primary p-3 rounded-xl shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email Perusahaan</h4>
                  <p className="text-gray-600 text-sm mt-1">hls@hlstransport.co.id</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 text-hls-primary p-3 rounded-xl shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Jam Operasional</h4>
                  <p className="text-gray-600 text-sm mt-1">Senin - Sabtu: 08.00 - 18.00 WITA<br/>Minggu: Tutup</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gray-50 text-hls-primary p-3 rounded-xl shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Kantor Pusat</h4>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">Jl. Jendral Sudirman No. 41B, Rembiga, Mataram, NTB</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}