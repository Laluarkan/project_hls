import Link from 'next/link';
import { getHomeData } from '@/lib/api';
import { ArrowRight, Building2, Users } from 'lucide-react';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface Service {
  id: number;
  title: string;
  description: string;
  image_url: string;
}

interface Equipment {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  specifications: string;
  category?: {
    name: string;
  };
}

const getImageUrl = (url: string) => {
  if (!url) return "https://images.unsplash.com/photo-1541888081180-28564f891d4d?q=80&w=800&auto=format&fit=crop";
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
  return `${baseUrl}${url}`;
};

export default async function Home() {
  const data = await getHomeData();
  const services: Service[] = data?.services || [];
  const equipments: Equipment[] = data?.equipments || [];

  const clients = [
    { src: "/images/wika.png", alt: "WIKA" },
    { src: "/images/PP.webp", alt: "PP" },
    { src: "/images/NK.webp", alt: "Nindya" },
    { src: "/images/trakindo.webp", alt: "Trakindo" },
  ];
  const displayClients = [...clients, ...clients, ...clients, ...clients];

  return (
    <div className="relative overflow-hidden">
      <section className="relative h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=2070&auto=format&fit=crop" 
          alt="Heavy Equipment Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-20 flex flex-col items-center">
          <AnimateOnScroll direction="down" delay={100}>
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs md:text-sm font-semibold tracking-wider mb-6">
              LOGISTIK ALAT BERAT TERPERCAYA
            </span>
          </AnimateOnScroll>
          
          <AnimateOnScroll direction="up" delay={300}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Keandalan & Keselamatan dalam Setiap Pergerakan Alat Berat Anda.
            </h1>
          </AnimateOnScroll>
          
          <AnimateOnScroll direction="up" delay={500}>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Kami menyediakan solusi logistik menyeluruh untuk penyewaan, mobilisasi, dan relokasi armada alat berat melintasi berbagai medan industri dengan presisi tinggi.
            </p>
          </AnimateOnScroll>
          
          <AnimateOnScroll direction="up" delay={700}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/kontak" 
                className="bg-hls-accent hover:bg-red-600 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Minta Penawaran
              </Link>
              <Link 
                href="/alat-berat" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-hls-primary px-8 py-4 rounded-lg font-bold transition-all"
              >
                Lihat Katalog
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 space-y-6 relative z-10">
              <AnimateOnScroll direction="right" delay={100}>
                <h2 className="text-3xl md:text-4xl font-bold text-hls-primary">Tentang Kami</h2>
                <div className="w-20 h-1.5 bg-hls-accent mt-4"></div>
              </AnimateOnScroll>
              
              <AnimateOnScroll direction="right" delay={300}>
                <div className="text-gray-600 space-y-4 leading-relaxed text-lg pt-4">
                  <p>
                    <strong className="text-gray-900">Hanqia Lintas Sarana (PT HLS)</strong> hadir sebagai solusi terpercaya untuk mensupport project sewa menyewakan alat berat (rental alat berat) di area Mataram, Lombok, Sumbawa, Bima, dan Dompu, meliputi penyediaan Crane, Forklift, Excavator, serta mobilisasi alat berat.
                  </p>
                  <p>
                    Lebih dari sekadar alat berat, kami juga bergerak secara profesional di bidang jasa angkutan pengiriman barang, pindahan (moving), serta charter truk skala besar.
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll direction="right" delay={500}>
                <div className="pt-6 flex flex-col sm:flex-row gap-6">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-3 rounded-lg text-hls-primary mr-4"><Building2 className="w-6 h-6" /></div>
                    <div>
                      <h4 className="font-bold text-gray-900">Armada Lengkap</h4>
                      <p className="text-sm text-gray-500">Terawat & siap kerja</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-3 rounded-lg text-hls-primary mr-4"><Users className="w-6 h-6" /></div>
                    <div>
                      <h4 className="font-bold text-gray-900">Tenaga Ahli</h4>
                      <p className="text-sm text-gray-500">Operator bersertifikat SIO</p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll direction="right" delay={700}>
                <div className="pt-6">
                  <Link 
                    href="/alat-berat" 
                    className="block w-full text-center border border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Selengkapnya
                  </Link>
                </div>
              </AnimateOnScroll>
            </div>

            <div className="w-full lg:w-1/2 relative">
              <AnimateOnScroll direction="left" delay={400}>
                <div className="absolute inset-0 bg-hls-primary/10 transform translate-x-4 translate-y-4 rounded-2xl"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop" 
                  alt="Tim HLS Transport" 
                  className="w-full h-auto rounded-2xl shadow-xl relative z-10 object-cover aspect-[4/3]"
                />
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-hls-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <div className="mb-16 text-center md:text-left flex flex-col md:flex-row justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-hls-primary">Layanan Unggulan Kami</h2>
                <div className="w-20 h-1.5 bg-hls-primary mt-4 mx-auto md:mx-0"></div>
              </div>
              <p className="text-gray-600 max-w-xl mt-4 md:mt-0 md:text-right text-sm">
                Jenis-jenis layanan logistik terintegrasi yang kami sediakan untuk memastikan proyek Anda berjalan tanpa hambatan.
              </p>
            </div>
          </AnimateOnScroll>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service: Service, index: number) => {
              return (
                <AnimateOnScroll key={service.id} direction="up" delay={index * 200}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
                    <div className="relative h-60 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={getImageUrl(service.image_url)} 
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-hls-primary/90 via-hls-primary/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <h3 className="absolute bottom-5 left-6 right-6 text-2xl font-bold text-white leading-snug">{service.title}</h3>
                    </div>
                    
                    <div className="p-6 grow flex flex-col">
                      <p className="text-gray-600 leading-relaxed text-sm mb-6">
                        {service.description}
                      </p>
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <Link href="/layanan" className="inline-flex items-center text-hls-accent font-semibold text-sm hover:text-red-700 transition-colors group/link">
                          Pelajari Lebih Lanjut <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-hls-primary">Armada Tersedia</h2>
                <div className="w-20 h-1.5 bg-hls-primary mt-4"></div>
              </div>
              <Link href="/alat-berat" className="hidden md:flex items-center text-hls-primary font-semibold hover:text-hls-accent transition-colors">
                Lihat Semua Armada <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipments.map((equipment: Equipment, index: number) => (
              <AnimateOnScroll key={equipment.id} direction="up" delay={index * 150}>
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={getImageUrl(equipment.image_url)} 
                      alt={equipment.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-blue-50 border border-blue-100 text-hls-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      Available
                    </div>
                  </div>
                  
                  <div className="p-5 grow flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium mb-3">
                        {equipment.category?.name || 'Heavy Equipment'}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">{equipment.name}</h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        {equipment.specifications
                          .split('\n')
                          .map(line => line.replace(/\|/g, '').trim())
                          .filter(line => line !== '' && line.includes(':'))
                          .slice(0, 4)
                          .map((spec: string, i: number) => {
                            const parts = spec.split(':');
                            const label = parts[0];
                            const value = parts.slice(1).join(':');
                            return (
                              <div key={i}>
                                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">{label?.trim()}</p>
                                <p className="font-semibold text-gray-800">{value?.trim() || '-'}</p>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    
                    <Link 
                      href={`/alat-berat/${equipment.slug}`}
                      className="block w-full text-center border-2 border-hls-primary text-hls-primary hover:bg-hls-primary hover:text-white py-2.5 rounded-lg font-semibold transition-colors mt-4"
                    >
                      Selengkapnya
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
             <Link href="/alat-berat" className="inline-flex items-center text-hls-primary font-semibold hover:text-hls-accent transition-colors">
              Lihat Semua Armada <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-t border-gray-200 overflow-hidden relative">
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              animation: scroll 30s linear infinite;
              display: flex;
              width: max-content;
            }
          `
        }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Klien Kami</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Perusahaan-perusahaan besar yang telah mempercayakan kebutuhan logistik dan alat berat mereka kepada layanan kami.
              </p>
            </div>
          </AnimateOnScroll>
        </div>

        <div className="relative w-full overflow-hidden mt-8">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

          <div className="animate-scroll gap-12 md:gap-24 items-center px-6">
            {displayClients.map((client, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                key={index} 
                src={client.src} 
                alt={client.alt} 
                className="h-10 md:h-16 object-contain shrink-0" 
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}