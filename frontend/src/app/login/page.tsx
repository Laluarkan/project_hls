"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAxiosError } from 'axios';
import api from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (response.data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data?.message || 'Gagal login. Periksa kembali email dan password Anda.');
      } else {
        setError('Gagal login. Terjadi kesalahan sistem.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Background Image dengan Overlay */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=2070&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-hls-primary/60 mix-blend-multiply" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 backdrop-blur-xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <span className="font-bold text-2xl text-hls-primary tracking-tight">HLS Transport</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang</h1>
            <p className="text-gray-500 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-hls-primary focus:border-transparent outline-none transition-all"
                placeholder="admin@hlstransport.co.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-sm font-medium text-hls-primary hover:text-blue-800">Lupa password?</a>
              </div>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-hls-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-hls-primary hover:bg-blue-900 text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center disabled:opacity-70"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Kembali ke <Link href="/" className="font-semibold text-hls-primary hover:underline">Beranda</Link>
          </div>
        </div>
      </div>
    </div>
  );
}