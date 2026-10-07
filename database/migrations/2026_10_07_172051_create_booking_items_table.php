<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('booking_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('court_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('time_slot_id')
                ->constrained()
                ->restrictOnDelete();

            $table->date('booking_date');

            $table->decimal('price', 10, 2);

            $table->timestamps();

            // Prevent double booking of the same
            // court + date + time slot.
            $table->unique([
                'court_id',
                'time_slot_id',
                'booking_date',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_items');
    }
};