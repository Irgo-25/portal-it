<?php

namespace App\Services;

use App\Models\Uom;
use Illuminate\Http\Request;

class UomService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }
    public function view(Request $request)
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

        return Uom::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('symbol', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn($uom) => [
                'id_uom' => $uom->id_uom,
                'name' => $uom->name,
                'symbol' => $uom->symbol,
            ]);
    }
    public function store(array $data)
    {
        $data = Uom::create([
            'name' => $data['name'],
            'symbol' => $data['symbol'],
        ]);
        return $data;
    }
    public function update(Uom $uom, array $data)
    {
        $uom->updateOrFail([
            'name' => $data['name'] ?? $uom->name,
            'symbol' => $data['symbol'] ?? $uom->symbol,
        ]);
        return $uom;
    }
    public function delete(Uom $uom)
    {
        $uom->delete();
    }
    public function bulkDelete(Request $request)
    {
        $id_uoms = $request->ids;
        Uom::whereIn('id_uom', $id_uoms)->delete();
    }
}
