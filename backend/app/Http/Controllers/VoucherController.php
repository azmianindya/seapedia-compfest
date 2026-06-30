<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{

    public function check(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric',
        ]);

        $voucher = Voucher::where('code', strtoupper($request->code))->first();

        if (!$voucher || !$voucher->isValid()) {
            return response()->json(['message' => 'Voucher tidak valid atau sudah kedaluwarsa'], 422);
        }

        if ($request->subtotal < $voucher->min_purchase) {
            return response()->json([
                'message' => 'Minimal belanja Rp ' . number_format($voucher->min_purchase, 0, ',', '.') . ' untuk voucher ini',
            ], 422);
        }

        $discount = $voucher->type === 'percentage'
            ? $request->subtotal * ($voucher->value / 100)
            : $voucher->value;

        if ($voucher->max_discount && $discount > $voucher->max_discount) {
            $discount = $voucher->max_discount;
        }

        return response()->json([
            'voucher' => $voucher,
            'discount' => round($discount),
        ]);
    }

    public function index()
    {
        return response()->json(['vouchers' => Voucher::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:vouchers,code',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'expires_at' => 'required|date|after:now',
            'usage_limit' => 'nullable|integer|min:1',
        ]);

        $voucher = Voucher::create([
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'min_purchase' => $request->min_purchase ?? 0,
            'max_discount' => $request->max_discount,
            'expires_at' => $request->expires_at,
            'usage_limit' => $request->usage_limit,
        ]);

        return response()->json(['message' => 'Voucher berhasil dibuat', 'voucher' => $voucher], 201);
    }

    public function destroy($id)
    {
        Voucher::findOrFail($id)->delete();
        return response()->json(['message' => 'Voucher berhasil dihapus']);
    }
}