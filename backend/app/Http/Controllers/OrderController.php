<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Voucher;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'voucher_code' => 'nullable|string',
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
        $voucher = null;

        if ($request->voucher_code) {
            $voucher = Voucher::where('code', strtoupper($request->voucher_code))->first();

            if (!$voucher || !$voucher->isValid()) {
                return response()->json(['message' => 'Voucher tidak valid atau sudah kedaluwarsa'], 422);
            }

            if ($subtotal < $voucher->min_purchase) {
                return response()->json([
                    'message' => 'Minimal belanja Rp ' . number_format($voucher->min_purchase, 0, ',', '.') . ' untuk voucher ini',
                ], 422);
            }

            $discount = $voucher->type === 'percentage'
                ? $subtotal * ($voucher->value / 100)
                : $voucher->value;

            if ($voucher->max_discount && $discount > $voucher->max_discount) {
                $discount = $voucher->max_discount;
            }

            $discount = round($discount);
        }

        $total = $subtotal + $shippingCost + $tax - $discount;

        $wallet = Wallet::firstOrCreate(['user_id' => $user->id], ['balance' => 0]);
        if ($wallet->balance < $total) {
            return response()->json(['message' => 'Saldo wallet tidak cukup'], 422);
        }

        $order = DB::transaction(function () use ($user, $cart, $subtotal, $shippingCost, $tax, $discount, $total, $wallet, $request, $voucher) {
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

            if ($voucher) {
                $voucher->increment('used_count');
            }

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

    public function expense(Request $request)
    {
        $total = Order::where('user_id', $request->user()->id)->sum('total');
        $count = Order::where('user_id', $request->user()->id)->count();

        return response()->json([
            'total_expense' => $total,
            'order_count' => $count,
        ]);
    }
}