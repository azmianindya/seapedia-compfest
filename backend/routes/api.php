<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/stores/{id}', [StoreController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/switch-role', [AuthController::class, 'switchRole']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/seller/store', [StoreController::class, 'myStore']);
        Route::post('/seller/store', [StoreController::class, 'create']);
        Route::put('/seller/store', [StoreController::class, 'update']);
        Route::get('/seller/products', [ProductController::class, 'myProducts']);
        Route::post('/seller/products', [ProductController::class, 'store']);
        Route::put('/seller/products/{id}', [ProductController::class, 'update']);
        Route::delete('/seller/products/{id}', [ProductController::class, 'destroy']);
    });
});