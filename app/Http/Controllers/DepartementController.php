<?php

namespace App\Http\Controllers;

use App\Http\Requests\Departement\StoreDepartement;
use App\Http\Requests\Departement\UpdateDepartement;
use App\Models\Departement;
use App\Services\DepartementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartementController extends Controller
{
    protected DepartementService $departementService;
    public function __construct(DepartementService $departementService)
    {
        $this->departementService = $departementService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $departements = $this->departementService->view($request);
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
    public function store(StoreDepartement $request)
    {
        $this->departementService->store($request->validated());
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
    public function update(UpdateDepartement $request, Departement $departement) {
        $this->departementService->update($departement, $request->validated());
        return redirect()->route('departements.index')->with('success', 'Departement updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Departement $departement)
    {
        $this->departementService->destroy($departement);
        return redirect()->route('departements.index')->with('success', 'Departement deleted successfully.');
    }
     public function bulkDelete (Request $request){
        $this->departementService->bulkDelete($request);
        return redirect()->route('departements.index')->with('success', 'Departements deleted successfully.');
    }
}
