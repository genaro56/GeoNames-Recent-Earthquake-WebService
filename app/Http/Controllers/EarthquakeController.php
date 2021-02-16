<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class EarthquakeController extends Controller
{
    public function __invoke(Request $request)
    {
        $start = $request->query('start');

        $end = $request->query('end');

        // var_dump([$start, $end]);

        $api_data = Http::get("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime={$start}&endtime={$end}&limit=10&orderby=magnitude");

        return $api_data;
    }
}
