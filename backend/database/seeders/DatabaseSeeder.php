<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Equipment;
use App\Models\Service;
use App\Models\Testimonial;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        $catExcavator = Category::create([
            'name' => 'Excavator', 
            'slug' => 'excavator', 
            'description' => 'Alat berat untuk penggalian dan pemindahan material.'
        ]);
        
        $catCrane = Category::create([
            'name' => 'Mobile Crane', 
            'slug' => 'mobile-crane', 
            'description' => 'Alat angkat berat untuk konstruksi dan logistik.'
        ]);
        
        $catBulldozer = Category::create([
            'name' => 'Bulldozer', 
            'slug' => 'bulldozer', 
            'description' => 'Alat berat untuk pemerataan tanah dan pembersihan area.'
        ]);
        
        $catTruck = Category::create([
            'name' => 'Dump Truck', 
            'slug' => 'dump-truck', 
            'description' => 'Truk pengangkut material proyek.'
        ]);

        Service::create([
            'title' => 'Mobilisasi Alat Berat',
            'description' => 'Layanan transportasi khusus untuk unit berat dan oversized. Dengan armada lowbed dan dolly berkapasitas tinggi, kami memastikan aset berharga Anda tiba di lokasi proyek tepat waktu dengan standar keselamatan tertinggi, mengurus seluruh perizinan rute dan pengawalan jalan.',
            'image_url' => '/images/services/mobilisasi.jpg'
        ]);
        
        Service::create([
            'title' => 'Crane, Forklift & Excavator',
            'description' => 'Menyediakan berbagai kapasitas alat angkat dan gali yang dirawat secara berkala. Unit kami dilengkapi dengan operator bersertifikat (SIO) yang berpengalaman di medan sulit maupun area pabrik yang membutuhkan presisi tinggi.',
            'image_url' => '/images/services/rental.jpg'
        ]);
        
        Service::create([
            'title' => 'Spesialis Moving & Relokasi',
            'description' => 'Pemindahan mesin industri yang memerlukan perlakuan khusus. Mulai dari jacking, rolling, hingga positioning di titik akurat tanpa merusak struktur lantai pabrik atau integritas mesin itu sendiri.',
            'image_url' => '/images/services/moving.jpg'
        ]);

        Equipment::create([
            'category_id' => $catExcavator->id,
            'name' => 'Caterpillar 320D',
            'slug' => 'caterpillar-320d',
            'image_url' => '/images/equipments/cat-320d.jpg',
            'specifications' => 'Kapasitas: 20 Ton | Kapasitas Bucket: 0.9 m3 | Tahun: 2018',
            'daily_rate' => 1500000,
            'status' => 'available'
        ]);
        
        Equipment::create([
            'category_id' => $catExcavator->id,
            'name' => 'Komatsu PC200-8',
            'slug' => 'komatsu-pc200-8',
            'image_url' => '/images/equipments/komatsu-pc200.jpg',
            'specifications' => 'Kapasitas: 20 Ton | Kapasitas Bucket: 0.8 m3 | Tahun: 2019',
            'daily_rate' => 1600000,
            'status' => 'available'
        ]);
        
        Equipment::create([
            'category_id' => $catCrane->id,
            'name' => 'Tadano GR-500EXL',
            'slug' => 'tadano-gr-500exl',
            'image_url' => '/images/equipments/tadano-crane.jpg',
            'specifications' => 'Kapasitas Angkat: 50 Ton | Panjang Boom: 42 m | Tipe: Rough Terrain',
            'daily_rate' => 5000000,
            'status' => 'maintenance'
        ]);

        Testimonial::create([
            'client_name' => 'Bambang',
            'company_name' => 'Mitra Konstruksi',
            'message' => 'Tempat sewa crane lombok dan alat berat yang terpercaya. Nice and Go. Operasional di Mataram sangat lancar.',
            'client_image_url' => '/images/testimonials/bambang.jpg'
        ]);
    }
}