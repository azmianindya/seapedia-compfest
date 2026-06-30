<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
        ]);

        $user = $request->user();
        $cart = Cart::with('items.product')->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Keranjang kosong'], 422);
        }

        $subtotal = $cart->items->sum(fn($item) => $item->product->price * $item->quantity);
        $shippingCost = 15000;
        $tax = round($subtotal * 0.12);
        $discount = 0;
        $total = $subtotal + $shippingCost + $tax - $discount;

        $wallet = Wallet::firstOrCreate(['user_id' => $user->id], ['balance' => 0]);
        if ($wallet->balance < $total) {
            return response()->json(['message' => 'Saldo wallet tidak cukup'], 422);
        }

        $order = DB::transaction(function () use ($user, $cart, $subtotal, $shippingCost, $tax, $discount, $total, $wallet, $request) {
            $order = Order::create([
                'user_id' => $user->id,
                'store_id' => $cart->store_id,
                'address_id' => $request->address_id,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'tax' => $tax,
                'discount' => $discount,
                'total' => $total,
                'status' => 'Sedang Dikemas',
            ]);

            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'price' => $item->product->price,
                    'quantity' => $item->quantity,
                ]);

                $item->product->decrement('stock', $item->quantity);
            }

            $wallet->decrement('balance', $total);

            $cart->items()->delete();
            $cart->update(['store_id' => null]);

            return $order;
        });

        return response()->json([
            'message' => 'Checkout berhasil',
            'order' => $order->load('items', 'store'),
        ], 201);
    }

    public function index(Request $request)
    {
        $orders = Order::with('items', 'store')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['orders' => $orders]);
    }

    public function show(Request $request, $id)
    {
        $order = Order::with('items', 'store', 'address')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json(['order' => $order]);
    }
}