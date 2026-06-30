<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    public function index()
    {
        $products = Product::with('store:id,name')->get();
        return response()->json(['products' => $products]);
    }

    public function show($id)
    {
        $product = Product::with('store:id,name,address,phone')->findOrFail($id);
        return response()->json(['product' => $product]);
    }

    public function myProducts(Request $request)
    {
        $store = $request->user()->store;
        if (!$store) return response()->json(['products' => []]);
        return response()->json(['products' => $store->products]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $store = $request->user()->store;
        if (!$store) return response()->json(['message' => 'Buat toko dulu sebelum menambah produk'], 422);

        $product = Product::create([
            'store_id' => $store->id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'category' => $request->category,
            'image' => $request->image,
        ]);

        return response()->json(['message' => 'Produk berhasil ditambahkan', 'product' => $product], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if ($product->store->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $product->update($request->only(['name', 'description', 'price', 'stock', 'category', 'image']));

        return response()->json(['message' => 'Produk berhasil diupdate', 'product' => $product]);
    }

    public function destroy(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if ($product->store->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus']);
    }
}