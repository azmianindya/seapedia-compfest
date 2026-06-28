<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['reviews' => $reviews]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'reviewer_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
        ]);

        $review = Review::create([
            'reviewer_name' => strip_tags($request->reviewer_name),
            'rating' => $request->rating,
            'comment' => strip_tags($request->comment),
            'user_id' => $request->user()?->id,
        ]);

        return response()->json([
            'message' => 'Review berhasil ditambahkan',
            'review' => $review,
        ], 201);
    }
}