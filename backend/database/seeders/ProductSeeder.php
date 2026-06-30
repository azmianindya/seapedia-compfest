<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Store;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $store = Store::first();
        if (!$store) return;

        $products = [
            ['name' => 'Ikan Tuna Segar', 'price' => 85000, 'stock' => 100, 'category' => 'Seafood Segar', 'description' => 'Ikan tuna segar langsung dari nelayan'],
            ['name' => 'Ikan Salmon Sashimi Grade', 'price' => 1260000, 'stock' => 50, 'category' => 'Seafood Segar', 'description' => 'Ikan salmon segar berkualitas tinggi'],
            ['name' => 'Udang Frozen Premium', 'price' => 590000, 'stock' => 60, 'category' => 'Seafood Beku', 'description' => 'Udang frozen berkualitas premium'],
            ['name' => 'Cumi Frozen', 'price' => 75000, 'stock' => 90, 'category' => 'Seafood Beku', 'description' => 'Cumi-cumi beku segar'],
            ['name' => 'Abon Ikan Tuna', 'price' => 440000, 'stock' => 40, 'category' => 'Olahan Laut', 'description' => 'Abon ikan tuna homemade'],
            ['name' => 'Bakso Ikan', 'price' => 30000, 'stock' => 120, 'category' => 'Olahan Laut', 'description' => 'Bakso ikan kenyal dan lezat'],
            ['name' => 'Nori Premium', 'price' => 25000, 'stock' => 80, 'category' => 'Rumput Laut', 'description' => 'Nori berkualitas premium'],
            ['name' => 'Rumput Laut Kering', 'price' => 25000, 'stock' => 100, 'category' => 'Rumput Laut', 'description' => 'Rumput laut kering pilihan'],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(
                ['name' => $product['name'], 'store_id' => $store->id],
                array_merge($product, ['store_id' => $store->id])
            );
        }
    }
}