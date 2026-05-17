<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemUom extends Model
{
    protected $table = 'item_uoms';
    protected $primaryKey = 'id_item_uom';

    protected $fillable = [
        'item_id', 'uom_id', 'is_base', 'conversion_factor'
    ];
    protected $casts = [
        'is_base' => 'boolean',
        'conversion_factor' => 'decimal:4',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'id_item');
    }
    public function uom()
    {
        return $this->belongsTo(Uom::class, 'uom_id', 'id_uom');
    }
}
