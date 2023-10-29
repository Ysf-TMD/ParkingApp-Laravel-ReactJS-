<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function(){
    Route::get("user",function(Request $request){
        return [
            "user"=>$request->user(),
            "currentToken"=>$request->bearerToken()
        ];
    }) ;
   Route::put("user/update/profile",[\App\Http\Controllers\ProfileController::class , "updateUserInfos"]);
   Route::put("user/update/password",[\App\Http\Controllers\ProfileController::class , "updateUserPassword"]);
   Route::post("user/logout",[\App\Http\Controllers\UserController::class , "logout"]);
   Route::get("sectors",[\App\Http\Controllers\SectorController::class , "index"]);
   Route::put("parking/{place}/start",[\App\Http\Controllers\PlaceController::class , "startParking"]);
   Route::put("parking/{place}/end",[\App\Http\Controllers\PlaceController::class , "endParking"]);
   Route::post("parking/pay",[\App\Http\Controllers\PaymentController::class , "payByStripe"]);
}) ;
Route::post("user/register",[\App\Http\Controllers\UserController::class ,"store"]);
Route::post("user/login",[\App\Http\Controllers\UserController::class ,"auth"]);
