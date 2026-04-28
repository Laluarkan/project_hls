"use client"

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Mengecek apakah URL saat ini adalah /login atau berawalan /admin
  const isAuthOrAdmin = pathname === '/login' || pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthOrAdmin && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAuthOrAdmin && <Footer />}
    </div>
  );
}