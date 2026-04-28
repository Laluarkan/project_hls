<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('equipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('image_url');
            $table->text('specifications');
            $table->decimal('daily_rate', 10, 2)->default(0); 
            $table->enum('status', ['available', 'maintenance', 'rented'])->default('available');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('equipments');
    }
};