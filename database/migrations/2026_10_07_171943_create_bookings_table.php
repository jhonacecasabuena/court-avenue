<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('booking_reference')
                ->unique();

            $table->decimal('subtotal', 10, 2);

            $table->decimal('service_fee', 10, 2)
                ->default(0);

            $table->decimal('total', 10, 2);

            $table->string('status')
                ->default('confirmed');

            $table->string('payment_status')
                ->default('paid');

            $table->string('payment_method')
                ->nullable();

            $table->string('payment_reference')
                ->nullable();

            $table->timestamp('paid_at')
                ->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};