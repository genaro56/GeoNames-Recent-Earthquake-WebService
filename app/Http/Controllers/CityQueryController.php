<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CityQueryController extends Controller
{
    public function __invoke(Request $request)
    {
        $north = $request->query('north');

        $south = $request->query('south');

        $west = $request->query('west');

        $east = $request->query('east');

        // var_dump([$north, $south, $west, $east]);

        $api_data = Http::get("http://api.geonames.org/earthquakesJSON?north={$north}&south={$south}&west={$west}&east={$east}&username=genaro");
        // var_dump($api_data);
        return $api_data;
    }
}
