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
        Schema::create('stock_opname_details', function (Blueprint $table) {
            $table->id('id_stock_opname_detail');
            $table->foreignId('stock_opname_id')->constrained('stock_opnames', 'id_stock_opname')->onDelete('cascade');
            $table->foreignId('item_id')->constrained('items', 'id_item')->onDelete('cascade');
            $table->foreignId('uom_id')->constrained('uoms', 'id_uom')->onDelete('cascade');
            $table->integer('conversion_factor')->default(1);
            $table->integer('system_quantity')->default(0);   // diambil dari items.stock saat opname dibuat
            $table->integer('opname_quantity')->default(0);   // hasil hitung fisik
            $table->integer('difference')->storedAs('opname_quantity - system_quantity'); // + surplus, - kurang
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['stock_opname_id', 'item_id']); // satu item hanya sekali per opname
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_opname_details');
    }
};
