<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipment extends Model {
    protected $table = 'equipments';
    protected $fillable = ['category_id', 'name', 'slug', 'image_url', 'specifications', 'daily_rate', 'status'];

    public function category() {
        return $this->belongsTo(Category::class);
    }
}