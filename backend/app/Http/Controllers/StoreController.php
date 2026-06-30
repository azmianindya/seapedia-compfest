<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function myStore(Request $request)
    {
        $store = $request->user()->store()->with('products')->first();
        if (!$store) return response()->json(['store' => null]);
        return response()->json(['store' => $store]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:stores,name',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        if ($request->user()->store) {
            return response()->json(['message' => 'Kamu sudah memiliki toko'], 422);
        }

        $store = Store::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'description' => $request->description,
            'address' => $request->address,
            'phone' => $request->phone,
        ]);

        return response()->json(['message' => 'Toko berhasil dibuat', 'store' => $store], 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:stores,name,' . $request->user()->store?->id,
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        $store = $request->user()->store;
        if (!$store) return response()->json(['message' => 'Toko tidak ditemukan'], 404);

        $store->update($request->only(['name', 'description', 'address', 'phone']));

        return response()->json(['message' => 'Toko berhasil diupdate', 'store' => $store]);
    }

    public function show($id)
    {
        $store = Store::with('products')->findOrFail($id);
        return response()->json(['store' => $store]);
    }
}