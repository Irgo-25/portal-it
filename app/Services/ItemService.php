<?php

namespace App\Services;

use App\Models\Item;

class ItemService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function generateCode(String $code)
    {
        $prefix = 'ITM';
        $number = str_pad($code, 4, '0', STR_PAD_LEFT);
        $isCode= "{$prefix}{$number}";
        $exists = Item::where('code', $isCode)->exists();

        if ($exists) {
            return $this->generateCode($code + 1);
        }
        return $isCode;
    }

    public function view($request)
    {
        $perPage = $request->get('perPage', 10);
        $search = $request->get('search', '');

        $allowedSorts = [

            'name',
            'symbol',
        ];

        $sortBy = in_array(
            $request->get('sortBy'),
            $allowedSorts
        )
            ? $request->get('sortBy')
            : 'name';

        $sortDirection = $request->get('sortDirection') === 'asc'
            ? 'asc'
            : 'desc';

        return Item::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('symbol', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn($item) => [
                'id_item' => $item->id_item,
                'name' => $item->name,
                'symbol' => $item->symbol,
            ]);
    }
}
