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
        Schema::create('items', function (Blueprint $table) {
            $table->id('id_item');
            $table->foreignId('category_id')->constrained('categories','id_category')->onDelete('cascade');
            $table->foreignId('uom_id')->constrained('uoms','id_uom')->onDelete('cascade');
            $table->string('code');
            $table->string('name');
            $table->decimal('stock',15,4)->default(0);
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
