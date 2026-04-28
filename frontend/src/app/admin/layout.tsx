"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Truck, 
  Tags, 
  Wrench, 
  Settings, 
  LogOut,
  Bell,
  Search
} from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        router.push('/');
      } else {
        setUser(parsedUser);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  if (!isMounted || !user) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    { name: 'Equipments', href: '/admin/equipments', icon: Truck },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Services', href: '/admin/services', icon: Wrench },
  ];

  return (
    <div className="flex h-screen bg-[#F4F7FA] font-sans">
      {/* SIDEBAR (Kiri) */}
      <aside className="w-64 bg-[#0A1D37] text-white hidden md:flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/10 bg-[#08182d]">
          <span className="text-xl font-bold tracking-tight text-white">HLS Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-2">Menu Utama</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#0056A0] text-white shadow-md' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 bg-[#08182d]">
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" /> Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8 z-10 shadow-sm">
          <div className="flex-1 flex">
            <div className="relative w-full max-w-md hidden sm:block">
            </div>
          </div>
          
          <div className="flex items-center space-x-5">
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-hls-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user?.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#F4F7FA]">
          {children}
        </main>
      </div>
    </div>
  );
}