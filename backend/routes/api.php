<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FrontendController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;

Route::get('/home', [FrontendController::class, 'getHomeData']);
Route::get('/services', [FrontendController::class, 'getServices']);
Route::get('/equipments', [FrontendController::class, 'getEquipments']);
Route::get('/categories', [FrontendController::class, 'getCategories']);
Route::post('/inquiry', [FrontendController::class, 'submitInquiry']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);

    Route::get('/admin/inquiries', [AdminController::class, 'getInquiries']);
    Route::put('/admin/inquiries/{id}/read', [AdminController::class, 'markAsRead']);

    Route::get('/admin/equipments', [AdminController::class, 'getAdminEquipments']);
    Route::post('/admin/equipments', [AdminController::class, 'storeEquipment']);
    Route::put('/admin/equipments/{id}', [AdminController::class, 'updateEquipment']);
    Route::delete('/admin/equipments/{id}', [AdminController::class, 'destroyEquipment']);

    Route::get('/admin/categories', [AdminController::class, 'getCategories']);
    Route::post('/admin/categories', [AdminController::class, 'storeCategory']);
    Route::put('/admin/categories/{id}', [AdminController::class, 'updateCategory']);
    Route::delete('/admin/categories/{id}', [AdminController::class, 'destroyCategory']);

    Route::get('/admin/services', [AdminController::class, 'getAdminServices']);
    Route::post('/admin/services', [AdminController::class, 'storeService']);
    Route::put('/admin/services/{id}', [AdminController::class, 'updateService']);
    Route::delete('/admin/services/{id}', [AdminController::class, 'destroyService']);
    
});