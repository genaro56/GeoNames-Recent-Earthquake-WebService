<?php

use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CityController;
use App\Http\Controllers\CityQueryController;
use App\Http\Controllers\EarthquakeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::apiResource('cities', CityController::class);

Route::get('/city-query', CityQueryController::class);

Route::get('/earthquakes', EarthquakeController::class);

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
