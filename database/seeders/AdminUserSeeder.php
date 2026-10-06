<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            [
                'email' => 'admin@courtavenue.com',
            ],
            [
                'name' => 'Court Avenue Admin',
                'password' => Hash::make('password'),
            ]
        );
        
        $admin->syncRoles(['admin']);    
    }
}
