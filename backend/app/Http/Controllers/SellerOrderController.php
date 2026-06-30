<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class SellerOrderController extends Controller
{
    public function index(Request $request)
    {
        $store = $request->user()->store;
        if (!$store) return response()->json(['orders' => []]);

        $orders = Order::with('items', 'address', 'user:id,name')
            ->where('store_id', $store->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['orders' => $orders]);
    }

    public function updateStatus(Request $request, $id)
    {
        $store = $request->user()->store;
        $order = Order::where('store_id', $store?->id)->findOrFail($id);

        if ($order->status !== 'Sedang Dikemas') {
            return response()->json(['message' => 'Order tidak bisa diubah dari status ini'], 422);
        }

        $order->update(['status' => 'Menunggu Pengirim']);

        return response()->json(['message' => 'Status order berhasil diubah', 'order' => $order]);
    }

    public function revenue(Request $request)
    {
        $store = $request->user()->store;
        if (!$store) return response()->json(['revenue' => 0, 'order_count' => 0]);

        $orders = Order::where('store_id', $store->id)
            ->whereIn('status', ['Menunggu Pengirim', 'Sedang Dikirim', 'Pesanan Selesai'])
            ->get();

        return response()->json([
            'revenue' => $orders->sum('subtotal'),
            'order_count' => $orders->count(),
        ]);
    }
}