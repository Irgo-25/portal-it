<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $table = 'items';
    protected $primaryKey = 'id_item';

    protected $fillable = [
        'code', 'name', 'stock', 'description', 'category_id', 'departement_id'
    ];
    protected $casts = [
        'stock' => 'decimal:4',
    ];
    
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id_category');
    }
    public function departement()
    {
        return $this->belongsTo(Departement::class, 'departement_id', 'id_departement');
    }
}
