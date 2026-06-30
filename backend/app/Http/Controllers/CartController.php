<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show(Request $request)
    {
        $cart = Cart::with('items.product', 'store')
            ->where('user_id', $request->user()->id)
            ->first();

        return response()->json(['cart' => $cart]);
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $product = Product::findOrFail($request->product_id);

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        if ($cart->store_id && $cart->store_id !== $product->store_id) {
            return response()->json([
                'message' => 'Keranjang kamu sudah berisi produk dari toko lain. Kosongkan dulu untuk belanja di toko ini.',
            ], 422);
        }

        if (!$cart->store_id) {
            $cart->update(['store_id' => $product->store_id]);
        }

        $item = $cart->items()->where('product_id', $product->id)->first();
        if ($item) {
            $item->increment('quantity', $request->quantity);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json([
            'message' => 'Produk ditambahkan ke keranjang',
            'cart' => $cart->load('items.product', 'store'),
        ]);
    }

    public function updateItem(Request $request, $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        $cart = Cart::where('user_id', $request->user()->id)->firstOrFail();
        $item = $cart->items()->findOrFail($id);
        $item->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Keranjang diupdate', 'cart' => $cart->load('items.product', 'store')]);
    }

    public function removeItem(Request $request, $id)
    {
        $cart = Cart::where('user_id', $request->user()->id)->firstOrFail();
        $item = $cart->items()->findOrFail($id);
        $item->delete();

        if ($cart->items()->count() === 0) {
            $cart->update(['store_id' => null]);
        }

        return response()->json(['message' => 'Produk dihapus dari keranjang', 'cart' => $cart->load('items.product', 'store')]);
    }
}