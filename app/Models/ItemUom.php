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
}
