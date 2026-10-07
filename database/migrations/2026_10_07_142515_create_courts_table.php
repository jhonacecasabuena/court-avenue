<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courts', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            $table->string('status')
                ->default('available');

            $table->text('description')
                ->nullable();

            $table->string('court_type')
                ->default('indoor');

            $table->unsignedTinyInteger('capacity')
                ->default(4);

            $table->string('lighting')
                ->default('LED');

            $table->string('image')
                ->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courts');
    }
};