import { CheckCircle2, Eye, Target } from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami | HLS Transport',
};

export default function TentangKami() {
  return (
    <div className="bg-hls-bg min-h-screen pb-24">
      {/* HERO SECTION (Placeholder Foto Karyawan) */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-hls-primary/80 to-slate-900/80 z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop" 
          alt="Tim HLS Transport" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto pt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Dedikasi Pada Keandalan</h1>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
            Membangun pondasi industri melalui penyediaan alat berat berkualitas dan layanan logistik yang terpercaya. Integritas adalah inti dari setiap operasi kami.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30 space-y-16">
        
        {/* SEJARAH KAMI SECTION */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-3xl font-bold text-hls-primary">Sejarah Kami</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600 leading-relaxed text-lg">
            <div className="space-y-6">
              <p>
                Berawal dari sebuah komitmen untuk mendukung pertumbuhan infrastruktur nasional, PT Hanqia Lintas Sarana (HLS Transport) didirikan dengan visi menjadi mitra strategis dalam penyediaan alat berat. Pada tahun-tahun awal, fokus kami adalah membangun armada yang handal dan merekrut tenaga operator serta teknisi yang sangat terlatih.
              </p>
              <p>
                Kami memahami bahwa dalam industri konstruksi dan logistik, waktu dan keandalan alat adalah mata uang utama. Oleh karena itu, investasi berkelanjutan pada pemeliharaan armada dan pembaruan teknologi manajemen aset selalu menjadi prioritas kami.
              </p>
            </div>
            <div className="space-y-6">
              <p>
                Seiring berjalannya waktu, portofolio layanan kami berkembang mencakup tidak hanya penyewaan alat berat konvensional seperti ekskavator dan bulldozer, tetapi juga solusi logistik terintegrasi untuk proyek-proyek berskala besar di wilayah Mataram, Lombok, dan sekitarnya.
              </p>
              <p>
                Hari ini, HLS Transport berdiri sebagai simbol stabilitas dan profesionalisme. Rekam jejak kami dalam menyelesaikan operasi logistik yang kompleks dengan tingkat keselamatan tertinggi menjadi bukti nyata dari dedikasi tim kami. Kami tidak hanya menyewakan alat; kami mengantarkan kepastian.
              </p>
            </div>
          </div>
        </section>

        {/* VISI & MISI SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* VISI CARD */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-50 text-hls-primary rounded-2xl flex items-center justify-center mb-8">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Visi Kami</h3>
            <p className="text-gray-600 leading-relaxed text-lg flex-grow">
              Menjadi perusahaan penyedia layanan logistik dan alat berat terkemuka yang diakui atas keandalan operasional, komitmen terhadap keselamatan tanpa kompromi, dan kontribusi nyata dalam pembangunan infrastruktur masa depan.
            </p>
          </div>

          {/* MISI CARD */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-red-50 text-hls-accent rounded-2xl flex items-center justify-center mb-8">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Misi Kami</h3>
            <ul className="space-y-4 text-gray-600 text-lg flex-grow">
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-hls-primary mr-4 flex-shrink-0 mt-0.5" />
                <span>Menyediakan armada alat berat yang terawat optimal dan mutakhir.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-hls-primary mr-4 flex-shrink-0 mt-0.5" />
                <span>Menerapkan standar Keselamatan dan Kesehatan Kerja (K3) tertinggi dalam setiap aspek operasional.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-hls-primary mr-4 flex-shrink-0 mt-0.5" />
                <span>Memberikan pelayanan logistik yang efisien, tepat waktu, dan transparan.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-hls-primary mr-4 flex-shrink-0 mt-0.5" />
                <span>Mengembangkan kompetensi sumber daya manusia secara berkesinambungan.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* BOTTOM BANNER SECTION */}
        <section className="relative rounded-3xl overflow-hidden h-[400px] flex items-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop" 
            alt="Standar Operasional Presisi" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="relative z-10 p-8 md:p-12 max-w-3xl">
            <h3 className="text-3xl font-bold text-white mb-4">Standar Operasional Presisi</h3>
            <p className="text-gray-200 text-lg">
              Keselamatan dan kesiapan armada adalah prioritas absolut. Tim mekanik ahli kami memastikan setiap unit siap bekerja maksimal sebelum diturunkan ke lapangan.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}