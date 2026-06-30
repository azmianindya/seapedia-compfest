<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class DriverOrderController extends Controller
{
    public function available(Request $request)
    {
        $orders = Order::with('items', 'store', 'address')
            ->where('status', 'Menunggu Pengirim')
            ->whereNull('driver_id')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['orders' => $orders]);
    }

    public function myJobs(Request $request)
    {
        $orders = Order::with('items', 'store', 'address')
            ->where('driver_id', $request->user()->id)
            ->where('status', 'Sedang Dikirim')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['orders' => $orders]);
    }

    public function history(Request $request)
    {
        $orders = Order::with('items', 'store', 'address')
            ->where('driver_id', $request->user()->id)
            ->where('status', 'Pesanan Selesai')
            ->orderBy('delivered_at', 'desc')
            ->get();

        return response()->json(['orders' => $orders]);
    }

    public function takeJob(Request $request, $id)
    {
        $order = Order::where('status', 'Menunggu Pengirim')
            ->whereNull('driver_id')
            ->findOrFail($id);

        $order->update([
            'driver_id' => $request->user()->id,
            'status' => 'Sedang Dikirim',
            'picked_up_at' => now(),
        ]);

        return response()->json(['message' => 'Job berhasil diambil', 'order' => $order]);
    }

    public function completeJob(Request $request, $id)
    {
        $order = Order::where('driver_id', $request->user()->id)
            ->where('status', 'Sedang Dikirim')
            ->findOrFail($id);

        $order->update([
            'status' => 'Pesanan Selesai',
            'delivered_at' => now(),
        ]);

        return response()->json(['message' => 'Pesanan berhasil dikonfirmasi selesai', 'order' => $order]);
    }

    public function earnings(Request $request)
    {
        $deliveryFee = 8000;

        $completedCount = Order::where('driver_id', $request->user()->id)
            ->where('status', 'Pesanan Selesai')
            ->count();

        $activeCount = Order::where('driver_id', $request->user()->id)
            ->where('status', 'Sedang Dikirim')
            ->count();

        return response()->json([
            'total_earnings' => $completedCount * $deliveryFee,
            'completed_count' => $completedCount,
            'active_count' => $activeCount,
            'fee_per_delivery' => $deliveryFee,
        ]);
    }
}