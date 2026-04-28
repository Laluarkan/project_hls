import Link from 'next/link';
import { getServices } from '@/lib/api';
import { CheckCircle2 } from 'lucide-react';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface Service {
  id: number;
  title: string;
  description: string;
  image_url: string;
}

export const metadata = {
  title: 'Layanan Kami | HLS Transport',
};

const getImageUrl = (url: string) => {
  if (!url) return "https://images.unsplash.com/photo-1541888081180-28564f891d4d?q=80&w=1200&auto=format&fit=crop";
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
  return `${baseUrl}${url}`;
};

export default async function Layanan() {
  const services: Service[] = await getServices();

  return (
    <div className="pt-32 pb-24 bg-hls-bg min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <AnimateOnScroll direction="down">
          <h1 className="text-4xl md:text-5xl font-bold text-hls-primary mb-6">Solusi Logistik & Alat Berat Terintegrasi</h1>
        </AnimateOnScroll>
        <AnimateOnScroll direction="up" delay={200}>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Kami merancang layanan kami untuk memastikan setiap tahap proyek Anda, dari mobilisasi hingga penempatan presisi, berjalan dengan aman, efisien, dan tanpa hambatan. Keandalan adalah pondasi operasional kami.
          </p>
        </AnimateOnScroll>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {services.map((service: Service, index: number) => {
          const isEven = index % 2 === 0;
          const animateDirection = isEven ? 'right' : 'left';

          return (
            <AnimateOnScroll key={service.id} direction={animateDirection}>
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-lg transition-shadow duration-300`}>
                <div className="w-full lg:w-1/2 h-72 lg:h-[450px] relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={getImageUrl(service.image_url)} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                
                <div className="w-full lg:w-1/2 p-8 lg:p-14">
                  <div className="w-14 h-14 bg-blue-50 text-hls-primary rounded-2xl flex items-center justify-center mb-8">
                     <span className="text-2xl font-bold">{service.title.charAt(0)}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{service.title}</h2>
                  <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-4 mb-10">
                    <li className="flex items-center text-gray-700 font-medium">
                      <CheckCircle2 className="w-6 h-6 text-hls-accent mr-3 flex-shrink-0" />
                      <span>Standar Keselamatan Tinggi (HSE)</span>
                    </li>
                    <li className="flex items-center text-gray-700 font-medium">
                      <CheckCircle2 className="w-6 h-6 text-hls-accent mr-3 flex-shrink-0" />
                      <span>Operator Bersertifikat (SIO)</span>
                    </li>
                    <li className="flex items-center text-gray-700 font-medium">
                      <CheckCircle2 className="w-6 h-6 text-hls-accent mr-3 flex-shrink-0" />
                      <span>Perencanaan Rute & Presisi Tinggi</span>
                    </li>
                  </ul>

                  <Link 
                    href="/kontak" 
                    className="inline-flex items-center justify-center bg-hls-primary hover:bg-blue-900 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-md hover:shadow-lg"
                  >
                    Konsultasi Layanan Ini
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          );
        })}
      </div>
    </div>
  );
}