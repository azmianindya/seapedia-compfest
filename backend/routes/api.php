<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\DriverOrderController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SellerOrderController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

// Public 
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/stores/{id}', [StoreController::class, 'show']);

// Protected 
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/switch-role', [AuthController::class, 'switchRole']);

    // Seller 
    Route::get('/seller/store', [StoreController::class, 'myStore']);
    Route::post('/seller/store', [StoreController::class, 'create']);
    Route::put('/seller/store', [StoreController::class, 'update']);
    Route::get('/seller/products', [ProductController::class, 'myProducts']);
    Route::post('/seller/products', [ProductController::class, 'store']);
    Route::put('/seller/products/{id}', [ProductController::class, 'update']);
    Route::delete('/seller/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/seller/orders', [SellerOrderController::class, 'index']);
    Route::put('/seller/orders/{id}/status', [SellerOrderController::class, 'updateStatus']);
    Route::get('/seller/revenue', [SellerOrderController::class, 'revenue']);

    // Buyer 
    Route::get('/wallet', [WalletController::class, 'show']);
    Route::post('/wallet/topup', [WalletController::class, 'topup']);

    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
    Route::post('/addresses/{id}/default', [AddressController::class, 'setDefault']);

    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::put('/cart/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);

    Route::post('/orders/checkout', [OrderController::class, 'checkout']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::get('/orders-expense', [OrderController::class, 'expense']);

    // Voucher
    Route::post('/vouchers/check', [VoucherController::class, 'check']);
    Route::get('/admin/vouchers', [VoucherController::class, 'index']);
    Route::post('/admin/vouchers', [VoucherController::class, 'store']);
    Route::delete('/admin/vouchers/{id}', [VoucherController::class, 'destroy']);

    // Driver
    Route::get('/driver/jobs/available', [DriverOrderController::class, 'available']);
    Route::get('/driver/jobs/mine', [DriverOrderController::class, 'myJobs']);
    Route::get('/driver/jobs/history', [DriverOrderController::class, 'history']);
    Route::post('/driver/jobs/{id}/take', [DriverOrderController::class, 'takeJob']);
    Route::post('/driver/jobs/{id}/complete', [DriverOrderController::class, 'completeJob']);
    Route::get('/driver/earnings', [DriverOrderController::class, 'earnings']);
});