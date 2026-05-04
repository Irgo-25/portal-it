<?php

namespace App\Http\Controllers;

use App\Models\Departement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
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

        $departements = Departement::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn($departement) => [
                'id_departement' => $departement->id_departement,
                'name' => $departement->name,
                'code' => $departement->code,
            ]);
        $filters = $request->only(['search', 'perPage', 'sortBy', 'sortDirection']);
        return Inertia::render('departements/index-departement', compact('departements', 'filters'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $departement = $request->validate([
            'name' => 'required',
            'code' => 'required|min:3',
        ]);
        Departement::create($departement);
        return redirect()->route('departements.index')->with('success', 'Departement created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Departement $departement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Departement $departement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Departement $departement) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Departement $departement)
    {
        Departement::findOrFail($departement)->delete();

        return redirect()
            ->route('departements.index')
            ->with('success', 'Departement deleted successfully');
    }
     public function bulkDelete (Request $request){
        $id_departements = $request->id_departements;
        return Departement::whereIn('id_departement', $id_departements)->delete();
        return back()->with(    
            'success', 'Deleted successfully'
        );
    }
}
