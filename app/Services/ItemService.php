<?php

namespace App\Services;

use App\Models\Item;
use Illuminate\Http\Request;
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
        $last = Item::orderBy('item_code', 'desc')->first();
        $number = $last ? (int) substr($last->item_code, 4) : 0;
        return 'ITM-' . str_pad($number + 1, 5, '0', STR_PAD_LEFT);
    }

    public function view($request)
    {
        $perPage = $request->get('perPage', 10);
        $search = $request->get('search', '');

        $allowedSorts = [

            'name',
            'code',
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
            ? 'asc'
            : 'desc';

        return Item::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->with(['category'])
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn($item) => [
                'id_item' => $item->id_item,
                'name' => $item->name,
                'item_code' => $item->item_code,
                'category_id' => $item->category_id,
                'departement_id' => $item->departement_id,
                'category' => $item->category?[
                    'id_category' => $item->category->id_category,
                    'name' => $item->category->name,
                ]: null,
                'stock' => (int) $item->stock,
            ]);
    }
    public function create(array $data): Item
    {
        return DB::transaction(function () use ($data) {
            $item = Item::create([
                'item_code' => $data['item_code'],
                'name' => $data['name'],
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
public function update(Item $item, array $data): Item
    {
        return DB::transaction(function () use ($item, $data) {
            $item->update([
                'name'           => $data['name'],
                'category_id'    => $data['category_id'],
            ]);

            $newUomIds = collect($data['uoms'])->pluck('uom_id')->toArray();

            // Hapus UOM yang tidak ada di list baru
            $item->itemUoms()->whereNotIn('uom_id', $newUomIds)->delete();

            // Update atau buat UOM baru
            foreach ($data['uoms'] as $uom) {
                $item->itemUoms()->updateOrCreate(
                    ['uom_id' => $uom['uom_id']],
                    [
                        'is_base'           => $uom['is_base'],
                        'conversion_factor' => $uom['is_base'] ? 1 : $uom['conversion_factor'],
                    ]
                );
            }

            return $item;
        });
    }

    public function destroy(Item $item)
    {
        return $item->delete();
    }
    public function bulkDelete(Request $request)
    {
        $id_items = $request->ids;
        Item::whereIn('id_item', $id_items)->delete();
    }

}

