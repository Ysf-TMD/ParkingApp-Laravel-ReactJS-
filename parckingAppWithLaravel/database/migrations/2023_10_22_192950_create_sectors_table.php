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
        Schema::create('sectors', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("hourly_price");
            $table->timestamps();
        });

        \App\Models\Sector::create([
            "name"=>"top sector",
            "hourly_price"=>10
        ]);
        \App\Models\Sector::create([
            "name"=>"left sector",
            "hourly_price"=>20
        ]);
        \App\Models\Sector::create([
            "name"=>"right sector",
            "hourly_price"=>30
        ]);
        \App\Models\Sector::create([
            "name"=>"down sector",
            "hourly_price"=>40
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sectors');
    }
};
