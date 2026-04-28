<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\Service;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FrontendController extends Controller
{
    public function getHomeData()
    {
        // Ambil 3 layanan terbaru
        $services = Service::orderBy('created_at', 'desc')->take(3)->get();
        
        // Ambil 6 armada terbaru yang statusnya available, gabung dengan nama kategori
        $equipments = DB::table('equipments')
            ->leftJoin('categories', 'equipments.category_id', '=', 'categories.id')
            ->select('equipments.*', 'categories.name as category_name')
            ->where('equipments.status', 'available')
            ->orderBy('equipments.created_at', 'desc')
            ->take(6)
            ->get();

        return response()->json([
            'services' => $services,
            'equipments' => $equipments
        ]);
    }

    public function getServices()
    {
        $services = Service::orderBy('created_at', 'desc')->get();
        return response()->json($services);
    }

    public function getEquipments()
    {
        $equipments = DB::table('equipments')
            ->leftJoin('categories', 'equipments.category_id', '=', 'categories.id')
            ->select('equipments.*', 'categories.name as category_name')
            ->orderBy('equipments.created_at', 'desc')
            ->get();
            
        return response()->json($equipments);
    }

    public function getCategories()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    public function submitInquiry(Request $request)
    {
        $request->validate([
            'sender_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        DB::table('inquiries')->insert([
            'sender_name' => $request->sender_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => 'unread',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Pesan berhasil dikirim']);
    }
}