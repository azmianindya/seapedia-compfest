<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        $addresses = $request->user()->addresses;
        return response()->json(['addresses' => $addresses]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'label' => 'required|string',
            'recipient_name' => 'required|string',
            'phone' => 'required|string',
            'full_address' => 'required|string',
        ]);

        $user = $request->user();
        $isFirst = $user->addresses()->count() === 0;

        $address = $user->addresses()->create([
            'label' => $request->label,
            'recipient_name' => $request->recipient_name,
            'phone' => $request->phone,
            'full_address' => $request->full_address,
            'is_default' => $isFirst,
        ]);

        return response()->json(['message' => 'Alamat berhasil ditambahkan', 'address' => $address], 201);
    }

    public function destroy(Request $request, $id)
    {
        $address = Address::where('user_id', $request->user()->id)->findOrFail($id);
        $address->delete();
        return response()->json(['message' => 'Alamat berhasil dihapus']);
    }

    public function setDefault(Request $request, $id)
    {
        $user = $request->user();
        $address = Address::where('user_id', $user->id)->findOrFail($id);

        $user->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return response()->json(['message' => 'Alamat utama berhasil diubah']);
    }
}