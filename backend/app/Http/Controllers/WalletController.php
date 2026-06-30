<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function show(Request $request)
    {
        $wallet = Wallet::firstOrCreate(['user_id' => $request->user()->id], ['balance' => 0]);
        return response()->json(['wallet' => $wallet]);
    }

    public function topup(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10000',
        ]);

        $wallet = Wallet::firstOrCreate(['user_id' => $request->user()->id], ['balance' => 0]);
        $wallet->increment('balance', $request->amount);

        return response()->json([
            'message' => 'Top up berhasil',
            'wallet' => $wallet->fresh(),
        ]);
    }
}