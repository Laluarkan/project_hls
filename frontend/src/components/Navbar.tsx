"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Layanan', href: '/layanan' },
    { name: 'Alat Berat', href: '/alat-berat' },
    { name: 'Tentang Kami', href: '/tentang-kami' },
    { name: 'Kontak', href: '/kontak' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 pt-4 px-4 transition-all duration-300">
      <nav className={`max-w-7xl mx-auto px-5 lg:px-8 rounded-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/40 backdrop-blur-md shadow-lg border border-white/10 py-2' 
          : 'bg-black/20 backdrop-blur-sm border border-white/20 py-2.5'
      }`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 transition-colors group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/logo.png" 
                alt="Logo HLS Transport" 
                className="h-8 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
              <div className="hidden sm:flex flex-col">
                <span className="font-bold text-sm md:text-base text-white leading-tight tracking-wide">Hanqia Lintas Sarana</span>
                <span className="text-[10px] md:text-xs text-gray-300 leading-tight mt-0.5">Transportasi & Alat Berat</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-white hover:text-gray-300 font-medium transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex">
            <Link 
              href="/kontak"
              className="bg-hls-accent hover:bg-red-600 text-white px-5 py-1.5 rounded-full font-medium transition-colors text-sm shadow-md"
            >
              Hubungi Marketing
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="block px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/kontak"
              className="block w-full text-center mt-3 bg-hls-accent text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-md"
              onClick={() => setIsOpen(false)}
            >
              Hubungi Marketing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}