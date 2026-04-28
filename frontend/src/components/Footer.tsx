import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  // Link langsung ke Google Maps berdasarkan alamat kantor
  const mapLink = "https://www.google.com/maps/search/?api=1&query=Jl.+Jendral+Sudirman+No.+41B,+Rembiga,+Kec.+Selaparang,+Kota+Mataram,+NTB";

  return (
    <footer className="bg-[#0A66C2] text-white pt-16 pb-8 border-t-4 border-hls-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* KOLOM 1: Info & Sosial Media */}
          <div className="col-span-1 md:col-span-5">
            <h2 className="text-2xl font-bold mb-4 tracking-wide text-white">PT HANQIA LINTAS SARANA</h2>
            <p className="text-blue-100 mb-8 max-w-md leading-relaxed text-sm">
              Jl. Jendral Sudirman No. 41B, Rembiga, Kec. Selaparang, Kota Mataram, Nusa Tenggara Barat, Indonesia.
            </p>
            
            <div>
              <h3 className="text-sm font-semibold mb-4 text-blue-200">Media Sosial</h3>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="bg-white text-[#0A66C2] p-2 rounded hover:bg-blue-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="bg-white text-[#0A66C2] p-2 rounded hover:bg-blue-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="bg-white text-[#0A66C2] p-2 rounded hover:bg-blue-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
                <a href="#" className="bg-white text-[#0A66C2] p-2 rounded hover:bg-blue-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
              </div>
              <Link href="/kontak" className="inline-block bg-white text-[#0A66C2] font-semibold px-6 py-2.5 rounded shadow hover:bg-gray-100 transition-colors text-sm">
                Kontak
              </Link>
            </div>
          </div>

          {/* KOLOM 2: Kontak */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Kontak</h3>
            <ul className="space-y-5">
              <li className="flex items-center">
                <span className="font-bold mr-2 text-sm w-20">Email:</span>
                <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm">hls@hlstransport.co.id</span>
              </li>
              <li className="flex items-center">
                <span className="font-bold mr-2 text-sm w-20">Office:</span>
                <span className="text-blue-50 text-sm">(0370) 7507966</span>
              </li>
              <li className="flex items-center">
                <span className="font-bold mr-2 text-sm w-20">Marketing:</span>
                <span className="text-blue-50 text-sm">0823-4106-5511</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2 text-sm w-20 mt-1">Support:</span>
                <div className="flex flex-col">
                  <span className="text-blue-50 text-sm">0812-3779-9222 /</span>
                  <span className="text-blue-50 text-sm mt-1">0817-5726-010</span>
                </div>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: Operasional & Peta */}
          <div className="col-span-1 md:col-span-4">
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Operasional & Lokasi</h3>
            <div className="mb-6 space-y-2">
              <p className="text-sm text-blue-100"><span className="font-bold text-white w-28 inline-block">Senin – Sabtu:</span> (08:00 – 18:00) WITA</p>
              <p className="text-sm text-blue-100"><span className="font-bold text-white w-28 inline-block">Minggu:</span> Tutup</p>
            </div>

            {/* PETA LOKASI */}
            <a 
              href={mapLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block relative rounded-xl overflow-hidden group shadow-lg border border-blue-400"
            >
              {/* Tempatkan file map-location.png di folder public/images/ */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/map-location.png" 
                alt="Peta Lokasi HLS Transport" 
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500 bg-blue-900"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop"; }}
              />
              <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-transparent transition-colors flex items-center justify-center">
                <div className="bg-white text-[#0A66C2] px-4 py-2 rounded-full text-xs font-bold flex items-center shadow-lg group-hover:bg-[#0A66C2] group-hover:text-white transition-colors">
                  <MapPin className="w-4 h-4 mr-1" /> Buka Google Maps
                </div>
              </div>
            </a>
          </div>
          
        </div>

        <div className="border-t border-blue-500/30 mt-16 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-100 text-sm font-medium">
            Copyright © {new Date().getFullYear()} <span className="font-bold text-white">PT. Hanqia Lintas Sarana.</span> All rights reserved
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4 text-sm text-blue-200">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}