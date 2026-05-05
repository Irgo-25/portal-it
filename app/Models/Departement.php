<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departement extends Model
{
    protected $table = 'departements';
    protected $primaryKey = 'id_departement';

    public $incrementing = true;

    protected $fillable = [
        'name',
        'code',
    ];
}
