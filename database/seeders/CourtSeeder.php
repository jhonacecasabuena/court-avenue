<?php

namespace Database\Seeders;

use App\Models\Court;
use Illuminate\Database\Seeder;

class CourtSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Court::create([
            'name' => 'Court 1',
            'status' => 'available',
            'description' => 'Premium pickleball court',
            'court_type' => 'indoor',
            'capacity' => 4,
            'lighting' => true,
            'image' => '/images/court_avenue/court.jpg',
            'price' => 300.00,
        ]);

        Court::create([
            'name' => 'Court 2',
            'status' => 'available',
            'description' => 'Premium pickleball court.',
            'court_type' => 'indoor',
            'capacity' => 4,
            'lighting' => true,
            'image' => '/images/court_avenue/court.jpg',
            'price' => 300.00,
        ]);

        Court::create([
            'name' => 'Court 3',
            'status' => 'available',
            'description' => 'Premium pickleball court.',
            'court_type' => 'indoor',
            'capacity' => 4,
            'lighting' => true,
            'image' => '/images/court_avenue/court.jpg',
            'price' => 300.00,
        ]);

        Court::create([
            'name' => 'Court 4',
            'status' => 'available',
            'description' => 'Premium pickleball court.',
            'court_type' => 'indoor',
            'capacity' => 4,
            'lighting' => true,
            'image' => '/images/court_avenue/court.jpg',
            'price' => 300.00,
        ]);
    }
}