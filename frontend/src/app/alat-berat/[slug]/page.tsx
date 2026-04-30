// frontend/src/app/alat-berat/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import api from '@/lib/api';
import InquiryButton from './InquiryButton'; // Kita buat komponen ini selanjutnya

// Fungsi untuk mengambil detail alat berdasarkan slug
async function getEquipmentDetail(slug: string) {
  try {
    const res = await api.get(`/equipments/${slug}`);
    return res.data.data;
  } catch (error) {
    return null;
  }
}

export default async function EquipmentDetailPage({ params }: { params: { slug: string } }) {
  const equipment = await getEquipmentDetail(params.slug);

  if (!equipment) {
    notFound();
  }

  // Fungsi untuk mem-parsing spesifikasi yang disimpan sebagai string dengan newline
  const parseSpecifications = (specs: string) => {
    if (!specs) return [];
    return specs.split('\n').filter(s => s.trim() !== '');
  };

  const specList = parseSpecifications(equipment.specifications);

  return (
    <div className="bg-gray-50 min-h-screen py-12 pt-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Beranda</Link> &gt;{' '}
          <Link href="/alat-berat" className="hover:text-blue-600">Alat Berat</Link> &gt;{' '}
          <span className="text-gray-900 font-medium">{equipment.name}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Bagian Gambar */}
            <div className="relative h-96 md:h-full min-h-[400px] bg-gray-100">
              <Image
                src={equipment.image_url || 'https://images.unsplash.com/photo-1541888081180-28564f891d4d?auto=format&fit=crop&q=80'}
                alt={equipment.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  equipment.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {equipment.status === 'available' ? 'Tersedia' : 'Dalam Perawatan'}
                </span>
              </div>
            </div>

            {/* Bagian Detail */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="uppercase tracking-wide text-sm text-blue-600 font-bold mb-2">
                {equipment.category?.name || 'Heavy Equipment'}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                {equipment.name}
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {equipment.description || 'Tidak ada deskripsi tersedia untuk unit ini.'}
              </p>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Spesifikasi Teknis</h3>
                <ul className="space-y-3">
                  {specList.map((spec: string, index: number) => {
                    const [key, value] = spec.split(':');
                    return (
                      <li key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{key?.trim() || spec}</span>
                        <span className="font-semibold text-gray-900">{value?.trim() || ''}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estimasi Sewa Harian</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {equipment.daily_rate ? `Rp ${equipment.daily_rate.toLocaleString('id-ID')}` : 'Hubungi Kami'}
                  </p>
                </div>
                
                {/* Tombol Inquiry Client Component */}
                <InquiryButton equipmentName={equipment.name} equipmentId={equipment.id} disabled={equipment.status !== 'available'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}