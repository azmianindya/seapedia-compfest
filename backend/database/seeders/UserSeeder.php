<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin SEAPEDIA',
            'email' => 'admin@seapedia.com',
            'password' => Hash::make('Admin123'),
            'active_role' => 'admin',
        ]);
        $admin->roles()->attach(Role::where('name', 'admin')->first());

        $seller = User::create([
            'name' => 'Seller Demo',
            'email' => 'seller@seapedia.com',
            'password' => Hash::make('Seller123'),
            'active_role' => 'seller',
        ]);
        $seller->roles()->attach(Role::where('name', 'seller')->first());

        $buyer = User::create([
            'name' => 'Buyer Demo',
            'email' => 'buyer@seapedia.com',
            'password' => Hash::make('Buyer123'),
            'active_role' => 'buyer',
        ]);
        $buyer->roles()->attach(Role::where('name', 'buyer')->first());

        $driver = User::create([
            'name' => 'Driver Demo',
            'email' => 'driver@seapedia.com',
            'password' => Hash::make('Driver123'),
            'active_role' => 'driver',
        ]);
        $driver->roles()->attach(Role::where('name', 'driver')->first());

        $multi = User::create([
            'name' => 'Multi Role Demo',
            'email' => 'multi@seapedia.com',
            'password' => Hash::make('Multi123'),
            'active_role' => null,
        ]);
        $multi->roles()->attach([
            Role::where('name', 'seller')->first()->id,
            Role::where('name', 'driver')->first()->id,
        ]);
    }
}