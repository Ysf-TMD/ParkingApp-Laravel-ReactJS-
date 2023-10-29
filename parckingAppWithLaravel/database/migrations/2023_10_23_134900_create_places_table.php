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
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->boolean("availlable")->default(1);
            $table->foreignId("sector_id")->nullable()->constrained();
            $table->foreignId("user_id")->nullable()->constrained();
            $table->datetime("start_time")->nullable();
            $table->datetime("end_time")->nullable();
            $table->integer("total_price")->nullable();
            $table->timestamps();
        });

        for($i=1;$i<=20;$i++){
            \App\Models\Place::create([
                "name"=>"place".$i,
                "sector_id"=>rand(1,3),

            ]);
        }



    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('places');
    }
};
