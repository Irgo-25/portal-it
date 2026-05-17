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
            $table->foreignId('departement_id')->constrained('departements','id_departement')->onDelete('cascade');
            $table->string('code')->unique();
            $table->string('name');
            $table->decimal('stock',15,2)->default(0);
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
