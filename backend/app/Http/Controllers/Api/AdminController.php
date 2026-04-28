<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\Category;
use App\Models\Service;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalEquipments = Equipment::count();
        $availableEquipments = Equipment::where('status', 'available')->count();
        $maintenanceEquipments = Equipment::where('status', 'maintenance')->count();

        $newInquiries = 0;
        $recentInquiries = [];
        
        if (Schema::hasTable('inquiries')) {
            $newInquiries = DB::table('inquiries')->where('status', 'unread')->count();
            $recentInquiries = DB::table('inquiries')->orderBy('created_at', 'desc')->limit(5)->get();
        }

        return response()->json([
            'metrics' => [
                'new_inquiries' => $newInquiries,
                'total_equipments' => $totalEquipments,
                'available_equipments' => $availableEquipments,
                'maintenance_equipments' => $maintenanceEquipments,
            ],
            'recent_inquiries' => $recentInquiries
        ]);
    }

    public function getInquiries(Request $request)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        if (Schema::hasTable('inquiries')) {
            $inquiries = DB::table('inquiries')->orderBy('created_at', 'desc')->get();
            return response()->json($inquiries);
        }
        return response()->json([]);
    }

    public function markAsRead(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        if (Schema::hasTable('inquiries')) {
            DB::table('inquiries')->where('id', $id)->where('status', 'unread')->update(['status' => 'read']);
            return response()->json(['message' => 'Pesan ditandai sudah dibaca']);
        }
        return response()->json(['message' => 'Tabel tidak ditemukan'], 404);
    }

    public function getAdminEquipments(Request $request)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $equipments = DB::table('equipments')
            ->leftJoin('categories', 'equipments.category_id', '=', 'categories.id')
            ->select('equipments.*', 'categories.name as category_name')
            ->orderBy('equipments.created_at', 'desc')
            ->get();
        return response()->json($equipments);
    }

    public function getCategories(Request $request)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $categories = Category::orderBy('created_at', 'desc')->get();
        return response()->json($categories);
    }

    public function storeCategory(Request $request)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $request->validate(['name' => 'required|string|max:255', 'description' => 'nullable|string']);
        $category = new Category();
        $category->name = $request->name;
        $category->slug = Str::slug($request->name);
        $category->description = $request->description;
        $category->save();
        return response()->json(['message' => 'Kategori berhasil ditambahkan', 'data' => $category], 201);
    }

    public function updateCategory(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $category = Category::findOrFail($id);
        $request->validate(['name' => 'required|string|max:255', 'description' => 'nullable|string']);
        $category->name = $request->name;
        if ($category->isDirty('name')) {
            $category->slug = Str::slug($request->name);
        }
        $category->description = $request->description;
        $category->save();
        return response()->json(['message' => 'Kategori berhasil diperbarui', 'data' => $category]);
    }

    public function destroyCategory(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $category = Category::findOrFail($id);
        $equipmentCount = DB::table('equipments')->where('category_id', $id)->count();
        if ($equipmentCount > 0) {
            return response()->json(['message' => 'Tidak dapat menghapus kategori karena masih digunakan oleh ' . $equipmentCount . ' armada.'], 422);
        }
        $category->delete();
        return response()->json(['message' => 'Kategori berhasil dihapus']);
    }

    public function storeEquipment(Request $request)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'image_file' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'specifications' => 'required|string',
            'daily_rate' => 'required|numeric|min:0',
            'status' => 'required|in:available,maintenance',
        ]);

        $equipment = new Equipment();
        $equipment->category_id = $request->category_id;
        $equipment->name = $request->name;
        $equipment->slug = Str::slug($request->name) . '-' . time();
        $equipment->specifications = $request->specifications;
        $equipment->daily_rate = $request->daily_rate;
        $equipment->status = $request->status;

        if ($request->hasFile('image_file')) {
            try {
                $image = $request->file('image_file');
                $imageUrl = $this->processAndStoreImage($image, 'equipments');
                $equipment->image_url = $imageUrl;
            } catch (\Exception $e) {
                return response()->json(['message' => 'Gagal memproses gambar. Detail: ' . $e->getMessage()], 500);
            }
        }
        $equipment->save();
        return response()->json(['message' => 'Equipment added successfully', 'data' => $equipment], 201);
    }

    public function updateEquipment(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $equipment = Equipment::findOrFail($id);
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'specifications' => 'required|string',
            'daily_rate' => 'required|numeric|min:0',
            'status' => 'required|in:available,maintenance',
        ]);

        $equipment->category_id = $request->category_id;
        $equipment->name = $request->name;
        if ($equipment->isDirty('name')) {
            $equipment->slug = Str::slug($request->name) . '-' . time();
        }
        $equipment->specifications = $request->specifications;
        $equipment->daily_rate = $request->daily_rate;
        $equipment->status = $request->status;

        if ($request->hasFile('image_file')) {
            try {
                if ($equipment->image_url && !str_contains($equipment->image_url, 'unsplash')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $equipment->image_url));
                }
                $image = $request->file('image_file');
                $imageUrl = $this->processAndStoreImage($image, 'equipments');
                $equipment->image_url = $imageUrl;
            } catch (\Exception $e) {
                return response()->json(['message' => 'Gagal memproses gambar. Detail: ' . $e->getMessage()], 500);
            }
        }
        $equipment->save();
        return response()->json(['message' => 'Equipment updated successfully', 'data' => $equipment]);
    }

    public function destroyEquipment(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $equipment = Equipment::findOrFail($id);
        if ($equipment->image_url && !str_contains($equipment->image_url, 'unsplash')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $equipment->image_url));
        }
        $equipment->delete();
        return response()->json(['message' => 'Equipment deleted successfully']);
    }

    // --- CRUD SERVICES ---

    public function getAdminServices(Request $request)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $services = Service::orderBy('created_at', 'desc')->get();
        return response()->json($services);
    }

    public function storeService(Request $request)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_file' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $service = new Service();
        $service->title = $request->title;
        $service->description = $request->description;

        if ($request->hasFile('image_file')) {
            try {
                $image = $request->file('image_file');
                $imageUrl = $this->processAndStoreImage($image, 'services');
                $service->image_url = $imageUrl;
            } catch (\Exception $e) {
                return response()->json(['message' => 'Gagal memproses gambar: ' . $e->getMessage()], 500);
            }
        }
        $service->save();
        return response()->json(['message' => 'Service added', 'data' => $service], 201);
    }

    public function updateService(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $service = Service::findOrFail($id);
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $service->title = $request->title;
        $service->description = $request->description;

        if ($request->hasFile('image_file')) {
            try {
                if ($service->image_url && !str_contains($service->image_url, 'unsplash')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $service->image_url));
                }
                $image = $request->file('image_file');
                $imageUrl = $this->processAndStoreImage($image, 'services');
                $service->image_url = $imageUrl;
            } catch (\Exception $e) {
                return response()->json(['message' => 'Gagal memproses gambar: ' . $e->getMessage()], 500);
            }
        }
        $service->save();
        return response()->json(['message' => 'Service updated', 'data' => $service]);
    }

    public function destroyService(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $service = Service::findOrFail($id);
        if ($service->image_url && !str_contains($service->image_url, 'unsplash')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $service->image_url));
        }
        $service->delete();
        return response()->json(['message' => 'Service deleted']);
    }

    // --- HELPER FUNCTION ---
    private function processAndStoreImage($imageFile, $folder = 'equipments')
    {
        $manager = new ImageManager(new Driver());
        $image = $manager->read($imageFile);
        
        if ($image->width() > 1200) {
            $image->scale(width: 1200);
        }

        $filename = $folder . '/' . Str::random(20) . '.webp';
        $encoded = $image->toWebp(80);
        Storage::disk('public')->put($filename, (string) $encoded);
        
        return Storage::url($filename);
    }
}