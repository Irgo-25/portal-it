<?php

namespace App\Services;

use App\Models\Item;
use Illuminate\Support\Facades\DB;

class ItemService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function generateCode()
    {
        $last = Item::orderBy('code', 'desc')->first();
        $number = $last ? (int) substr($last->code, 4) : 0;
        return 'ITM-' . str_pad($number + 1, 5, '0', STR_PAD_LEFT);
    }

    public function view($request)
    {
        $perPage = $request->get('perPage', 10);
        $search = $request->get('search', '');

        $allowedSorts = [

            'name',
            'code',
            'departement_id',
            'category_id',
            'stock',
        ];

        $sortBy = in_array(
            $request->get('sortBy'),
            $allowedSorts
        )
            ? $request->get('sortBy')
            : 'name';

        $sortDirection = $request->get('sortDirection') === 'desc'
            ? 'desc'
            : 'asc';

        return Item::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->with(['category', 'departement'])
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn($item) => [
                'id_item' => $item->id_item,
                'name' => $item->name,
                'code' => $item->code,
                'category_id' => $item->category_id,
                'departement_id' => $item->departement_id,
                'category' => $item->category?[
                    'id' => $item->category->id_category,
                    'name' => $item->category->name,
                ]: null,
                'departement' => $item->departement?[
                    'id' => $item->departement->id_departement,
                    'name' => $item->departement->name,
                ]: null,
                'stock' => (int) $item->stock,
            ]);
    }
    public function create(array $data): Item
    {
        return DB::transaction(function () use ($data) {
            $item = Item::create([
                'code'=> $data['code'],
                'name' => $data['name'],
                'departement_id' => $data['departement_id'],
                'category_id' => $data['category_id'],
                'stock' => 0,
            ]);
            foreach ($data['uoms'] as $uom) {
                $item->itemUoms()->create([
                    'uom_id' => $uom['uom_id'],
                    'is_base' => $uom['is_base'],
                    'conversion_factor' => $uom['is_base'] ? 1 : $uom['conversion_factor'],
                ]);
            }
            return $item;
        });
    }
}
