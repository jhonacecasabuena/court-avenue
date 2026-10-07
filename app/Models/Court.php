<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Court extends Model
{
    protected $fillable = [
        'name',
        'status',
        'description',
        'court_type',
        'capacity',
        'lighting',
        'image',
        'price',
    ];

    protected function casts(): array
    {
        return [
            'capacity' => 'integer',
            'lighting' => 'string',
            'price' => 'decimal:2',
        ];
    }
}