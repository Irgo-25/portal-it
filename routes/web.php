<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    // User
    Route::resource('users', UserController::class);
    Route::post('/users/bulk-delete',[UserController::class, 'bulkDelete'])->name('users.bulk-delete');

    // Departement
    Route::resource('departements', DepartementController::class);
    Route::post('/departements/bulk-delete',[DepartementController::class, 'bulkDelete'])->name('departements.bulk-delete');
    
    // Category
    Route::resource('categories', CategoryController::class);
    Route::post('/categories/bulk-delete',[CategoryController::class, 'bulkDelete'])->name('categories.bulk-delete');
});

require __DIR__ . '/settings.php';
