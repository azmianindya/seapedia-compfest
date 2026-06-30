<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $seller = User::where('email', 'seller@seapedia.com')->first();
        if (!$seller) return;

        Store::firstOrCreate(
            ['user_id' => $seller->id],
            [
                'name' => 'Toko Seafood Segar',
                'description' => 'Menjual berbagai produk seafood segar berkualitas',
                'address' => 'Jakarta Selatan',
                'phone' => '081234567890',
            ]
        );
    }
}