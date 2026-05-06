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
        Schema::create('item_uoms', function (Blueprint $table) {
            $table->id('id_item_uom');
            $table->foreignId('item_id')->constrained('items','id_item')->onDelete('cascade');
            $table->foreignId('uom_id')->constrained('uoms', 'id_uom')->onDelete('cascade');
            $table->boolean('is_base')->default(false);
            $table->decimal('conversion_factor',15,4)->default(0);
            $table->timestamps();
            $table->unique(['item_id', 'uom_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_uoms');
    }
};
