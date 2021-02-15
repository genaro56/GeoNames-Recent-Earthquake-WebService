<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $fillable = [
        'name',
        'data' => 'array',
    ];

    protected $casts = [
        'data' => 'json',
    ];

    public function setDataAttribute($values)
    {
        $data = [];

        foreach ($values as $array_item) {
            if (!is_null($array_item['key'])) {
                $data[] = $array_item;
            }
        }

        $this->attributes['data'] = json_encode($data);
    }
}
