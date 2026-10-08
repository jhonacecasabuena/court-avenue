<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'booking_reference',
        'subtotal',
        'service_fee',
        'total',
        'status',
        'payment_status',
        'payment_proof',
        'payment_method',
        'payment_reference',
        'paid_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'service_fee' => 'decimal:2',
            'total' => 'decimal:2',
            'paid_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Get bookings that currently occupy a court slot.
     *
     * Confirmed bookings are always active.
     * Pending bookings are active only while their expiration
     * time has not passed.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where(function (Builder $query) {
            $query
                ->where('status', 'confirmed')
                ->orWhere(function (Builder $query) {
                    $query
                        ->where('status', 'pending')
                        ->where('expires_at', '>', now());
                });
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(BookingItem::class);
    }
}