<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_transactions', function (Blueprint $table) {
            $table->id('id_stock_transaction');
            $table->foreignId('item_id')->constrained('items', 'id_item')->onDelete('cascade');
            $table->foreignId('oum_id')->constrained('uoms', 'id_uom')->onDelete('restrict');
            $table->foreignId('departement_id')->constrained('departements', 'id_departement')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['in', 'out']);
            $table->decimal('quantity',15,4)->default(0);
            $table->decimal('conversion_factor',15,4)->default(0);
            $table->decimal('base_quantity',15,4)->default(0);
            $table->timestamp('transaction_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_transactions');
    }
};
