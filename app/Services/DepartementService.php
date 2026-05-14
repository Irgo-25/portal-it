<?php

namespace App\Services;

use App\Http\Requests\Departement\StoreDepartement;
use App\Http\Requests\Departement\UpdateDepartement;
use App\Models\Departement;
use Illuminate\Http\Request;


class DepartementService
{
    public function view(Request $request)
    {
        $perPage = $request->get('perPage', 10);
        $search = $request->get('search', '');

        $allowedSorts = [
            'name',
            'code',
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

        return Departement::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn ($departement) => [
                'id_departement' => $departement->id_departement,
                'name' => $departement->name,
                'code' => $departement->code
            ]);
    }
    public function store(array $data)
    {
        $data = Departement::create([
            'name' => $data['name'],
            'code' => $data['code'],
        ]);
        return $data;
    }
    public function update( Departement $departement, array $data)
    {
        $departement->updateOrFail(
            [
                'name' => $data['name'] ?? $departement->name,
                'code' => $data['code'] ?? $departement->code,
            ]
        );
        return $departement;
    }
    public function destroy(Departement $departement)
    {
        return $departement->delete();
    }
    public function bulkDelete(Request $request)
    {
        $id_departements = $request->ids;
        return Departement::whereIn('id_departement', $id_departements)->delete();
    }
}
